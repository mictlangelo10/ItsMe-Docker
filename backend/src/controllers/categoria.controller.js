"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoriesByUser = exports.createCategory = void 0;
const conecction_1 = __importDefault(require("../conecction"));
// Función para registrar una nueva categoría
const createCategory = (req, res) => {
    const { id_usuario, titulo, descripcion, fecha_pub } = req.body;
    if (!id_usuario || !titulo || !fecha_pub) {
        res.status(400).json({ message: "Todos los campos son obligatorios" });
        return;
    }
    const formattedDate = new Date(fecha_pub).toISOString().split("T")[0];
    const sql = `
    INSERT INTO categoria (id_usuario, titulo, descripcion, fecha_pub)
    VALUES (?, ?, ?, ?)
  `;
    conecction_1.default.query(sql, [id_usuario, titulo, descripcion, formattedDate], (err, result) => {
        if (err) {
            console.error("Error al registrar la categoría:", err);
            res.status(500).json({ message: "Error al registrar la categoría" });
            return;
        }
        res.status(201).json({
            message: "Categoría registrada exitosamente",
            id: result.insertId,
        });
    });
};
exports.createCategory = createCategory;
// Función para obtener todas las categorías de un usuario
const getCategoriesByUser = (req, res) => {
    const { id_usuario } = req.params;
    if (!id_usuario) {
        res.status(400).json({ message: "El ID del usuario es obligatorio" });
        return;
    }
    const sql = `SELECT * FROM categoria WHERE id_usuario = ?`;
    conecction_1.default.query(sql, [id_usuario], (err, results) => {
        if (err) {
            console.error("Error al obtener las categorías:", err);
            res.status(500).json({ message: "Error al obtener las categorías" });
            return;
        }
        res.status(200).json(results);
    });
};
exports.getCategoriesByUser = getCategoriesByUser;
// Función para actualizar una categoría
const updateCategory = (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    if (!id || !titulo) {
        res.status(400).json({ message: "ID y título son obligatorios" });
        return;
    }
    const sql = `
    UPDATE categoria
    SET titulo = ?, descripcion = ?
    WHERE id = ?
  `;
    conecction_1.default.query(sql, [titulo, descripcion, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar la categoría:", err);
            res.status(500).json({ message: "Error al actualizar la categoría" });
            return;
        }
        res.status(200).json({ message: "Categoría actualizada exitosamente" });
    });
};
exports.updateCategory = updateCategory;
// Función para eliminar una categoría
// Función para eliminar una categoría y su contenido relacionado
const deleteCategory = (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "ID es obligatorio" });
        return;
    }
    // Primero eliminamos el contenido relacionado con la categoría
    const deleteContentSql = `
    DELETE FROM contenido
    WHERE id_cat = ?
  `;
    conecction_1.default.query(deleteContentSql, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar el contenido relacionado:", err);
            res
                .status(500)
                .json({ message: "Error al eliminar el contenido relacionado" });
            return;
        }
        // Luego eliminamos la categoría
        const deleteCategorySql = `
      DELETE FROM categoria
      WHERE id = ?
    `;
        conecction_1.default.query(deleteCategorySql, [id], (err, result) => {
            if (err) {
                console.error("Error al eliminar la categoría:", err);
                res.status(500).json({ message: "Error al eliminar la categoría" });
                return;
            }
            res
                .status(200)
                .json({
                message: "Categoría y contenido relacionado eliminados exitosamente",
            });
        });
    });
};
exports.deleteCategory = deleteCategory;
