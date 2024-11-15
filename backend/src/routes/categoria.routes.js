"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoria_controller_1 = require("../controllers/categoria.controller");
const JWT_1 = require("../middleware/JWT");
const router = (0, express_1.Router)();
router.post("/categorias", JWT_1.authenticateJWT, categoria_controller_1.createCategory);
router.get("/categorias/:id_usuario", JWT_1.authenticateJWT, categoria_controller_1.getCategoriesByUser);
router.put("/categorias/:id", JWT_1.authenticateJWT, categoria_controller_1.updateCategory);
router.delete("/categorias/:id", JWT_1.authenticateJWT, categoria_controller_1.deleteCategory);
exports.default = router;
