"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserInfo = exports.getUsers = exports.loginUser = exports.registerUser = exports.handleCheckUsername = exports.checkIfUsernameExists = void 0;
const conecction_1 = __importDefault(require("../conecction"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../middleware/config");
// Función para verificar si el email ya existe
const checkIfEmailExists = (email) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM usuario WHERE email = ?";
        conecction_1.default.query(sql, [email], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results.length > 0);
        });
    });
};
// Función para verificar si el username ya existe
const checkIfUsernameExists = (username) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM usuario WHERE username = ?";
        conecction_1.default.query(sql, [username], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results.length > 0);
        });
    });
};
exports.checkIfUsernameExists = checkIfUsernameExists;
// Nueva función controladora que usa checkIfUsernameExists
const handleCheckUsername = (req, res) => {
    const username = req.params.username;
    (0, exports.checkIfUsernameExists)(username)
        .then((exists) => res.status(200).json({ exists }))
        .catch((err) => {
        console.error("Error checking username:", err);
        res.status(500).json({ message: "Error checking username" });
    });
};
exports.handleCheckUsername = handleCheckUsername;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, username, edad, email, contrasenia, descripcion, foto } = req.body;
    try {
        const emailExists = yield checkIfEmailExists(email);
        if (emailExists) {
            res.status(400).json({ message: "El email ya existe" });
            return;
        }
        const usernameExists = yield (0, exports.checkIfUsernameExists)(username);
        if (usernameExists) {
            res.status(400).json({ message: "El username ya existe" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(contrasenia, 10); // Hash de la contraseña
        const sql = "INSERT INTO usuario (nombre, username, edad, email, contraseña, descripcion, foto) VALUES (?, ?, ?, ?, ?, ?, ?)";
        conecction_1.default.query(sql, [nombre, username, edad, email, hashedPassword, descripcion, foto], (err, result) => {
            if (err) {
                console.log("Error al registrar el usuario:", err);
                res.status(500).json({ message: "Error al registrar el usuario" });
                return;
            }
            res.status(201).json({
                message: "Usuario registrado exitosamente",
                id: result.insertId,
            });
        });
    }
    catch (error) {
        console.log("Error al registrar el usuario:", error);
        res.status(500).json({ message: "Error en el servidor", error });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, contraseña } = req.body;
    try {
        const sql = "SELECT * FROM usuario WHERE email = ?";
        conecction_1.default.query(sql, [email], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(500).json({ message: "Error en el servidor" });
                return;
            }
            if (results.length === 0) {
                res
                    .status(400)
                    .json({ message: "Correo electrónico o contraseña incorrect@" });
                return;
            }
            const user = results[0];
            const isPasswordValid = yield bcrypt_1.default.compare(contraseña, user.contraseña);
            if (!isPasswordValid) {
                res
                    .status(400)
                    .json({ message: "Correo electrónico o contraseña incorrect@" });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.jwtConfig.secret, { expiresIn: config_1.jwtConfig.expiresIn });
            res.status(200).json({
                message: "Login exitoso",
                token,
            });
        }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor", error });
    }
});
exports.loginUser = loginUser;
const getUsers = (req, res) => {
    const sql = "SELECT * FROM usuarios";
    conecction_1.default.query(sql, (err, results) => {
        if (err) {
            res.status(500).send("Error en la consulta a la base de datos");
            return;
        }
        res.json(results);
    });
};
exports.getUsers = getUsers;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: "Acceso no autorizado" });
        return;
    }
    const userId = req.user.id;
    try {
        const sql = "SELECT id, nombre, username, edad, email, descripcion, foto FROM usuario WHERE id = ?";
        conecction_1.default.query(sql, [userId], (err, results) => {
            if (err) {
                res.status(500).json({ message: "Error en el servidor" });
                return;
            }
            if (results.length === 0) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            res.status(200).json(results[0]);
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
});
exports.getUserInfo = getUserInfo;
// Función para actualizar la información del usuario
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id, 10); // Obtener ID de la URL
    const { nombre, username, edad, email, descripcion, foto } = req.body;
    if (!userId) {
        res.status(401).json({ message: "Acceso no autorizado" });
        return;
    }
    try {
        const sql = "UPDATE usuario SET nombre = ?, username = ?, edad = ?, email = ?, descripcion = ?, foto = ? WHERE id = ?";
        conecction_1.default.query(sql, [nombre, username, edad, email, descripcion, foto, userId], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error al actualizar el usuario" });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            res.status(200).json({ message: "Usuario actualizado exitosamente" });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor", error });
    }
});
exports.updateUser = updateUser;
// eliminar usuarios
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id, 10);
    if (!userId) {
        res.status(400).json({ message: "ID de usuario no válido" });
        return;
    }
    try {
        // Primero, elimina el contenido relacionado (opcional)
        const deleteContentsSql = "DELETE FROM contenido WHERE id_cat IN (SELECT id FROM categoria WHERE id_usuario = ?)";
        yield new Promise((resolve, reject) => {
            conecction_1.default.query(deleteContentsSql, [userId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        // Luego, elimina las categorías asociadas al usuario
        const deleteCategoriesSql = "DELETE FROM categoria WHERE id_usuario = ?";
        yield new Promise((resolve, reject) => {
            conecction_1.default.query(deleteCategoriesSql, [userId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        // Luego, elimina las redes asociadas al usuario
        const deleteRedsSql = "DELETE FROM red WHERE id_usuario = ?";
        yield new Promise((resolve, reject) => {
            conecction_1.default.query(deleteRedsSql, [userId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        // Finalmente, elimina el usuario
        const deleteUserSql = "DELETE FROM usuario WHERE id = ?";
        conecction_1.default.query(deleteUserSql, [userId], (err, result) => {
            if (err) {
                console.error("Error al eliminar el usuario", err);
                res.status(500).json({ message: "Error al eliminar el usuario" });
                return;
            }
            const affectedRows = result.affectedRows;
            if (affectedRows === 0) {
                res.status(404).json({ message: "Usuario no encontrado" });
                return;
            }
            res.status(200).json({ message: "Usuario eliminado exitosamente" });
        });
    }
    catch (error) {
        console.error("Error al eliminar el usuario", error);
        res.status(500).json({ message: "Error en el servidor", error });
    }
});
exports.deleteUser = deleteUser;
