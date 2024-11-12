"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkContentExistence = exports.getContentByCategory = exports.createContent = exports.getPlantillas = void 0;
const conecction_1 = __importDefault(require("../conecction"));
const getPlantillas = (req, res) => {
    const sql = "SELECT id, nombre, identificador FROM plantilla";
    conecction_1.default.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching plantillas:", err);
            res.status(500).json({ message: "Error al obtener las plantillas" });
            return;
        }
        res.status(200).json(results);
    });
};
exports.getPlantillas = getPlantillas;
// Crear nuevo contenido
const createContent = (req, res) => {
    const { id_cat, id_plantilla, titulo, body, fecha_pub } = req.body;
    if (!id_cat || !id_plantilla || !titulo || !fecha_pub) {
        res.status(400).json({ message: "Todos los campos son obligatorios" });
        return;
    }
    const formattedDate = new Date(fecha_pub).toISOString().split("T")[0];
    const sql = `
      INSERT INTO contenido (id_cat, id_plantilla, titulo, body, fecha_pub)
      VALUES (?, ?, ?, ?, ?)
    `;
    conecction_1.default.query(sql, [id_cat, id_plantilla, titulo, body, formattedDate], (err, result) => {
        if (err) {
            console.error("Error al crear el contenido:", err);
            res.status(500).json({ message: "Error al crear el contenido" });
            return;
        }
        res.status(201).json({
            message: "Contenido creado exitosamente",
            id: result.insertId,
        });
    });
};
exports.createContent = createContent;
// Obtener contenido por categoría
const getContentByCategory = (req, res) => {
    const { id_cat } = req.params;
    if (!id_cat) {
        res.status(400).json({ message: "El ID de la categoría es obligatorio" });
        return;
    }
    const sql = `SELECT * FROM contenido WHERE id_cat = ?`;
    conecction_1.default.query(sql, [id_cat], (err, results) => {
        if (err) {
            console.error("Error al obtener el contenido:", err);
            res.status(500).json({ message: "Error al obtener el contenido" });
            return;
        }
        res.status(200).json(results);
    });
};
exports.getContentByCategory = getContentByCategory;
// Verificar si ya existe contenido en una categoría
const checkContentExistence = (req, res) => {
    const { id_cat } = req.params;
    if (!id_cat) {
        res.status(400).json({ message: "El ID de la categoría es obligatorio" });
        return;
    }
    const sql = `SELECT COUNT(*) as count FROM contenido WHERE id_cat = ?`;
    conecction_1.default.query(sql, [id_cat], (err, results) => {
        if (err) {
            console.error("Error al verificar la existencia del contenido:", err);
            res.status(500).json({ message: "Error al verificar el contenido" });
            return;
        }
        const contentExists = results[0].count > 0;
        res.status(200).json({ contentExists });
    });
};
exports.checkContentExistence = checkContentExistence;
