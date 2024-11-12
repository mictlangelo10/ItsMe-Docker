"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const JWT_1 = require("../middleware/JWT");
const plantillas_controller_1 = require("../controllers/plantillas.controller");
const router = (0, express_1.Router)();
// Ruta para obtener plantillas
router.get("/plantillas", plantillas_controller_1.getPlantillas, JWT_1.authenticateJWT);
// Ruta para crear contenido
router.post("/contenido", JWT_1.authenticateJWT, plantillas_controller_1.createContent);
// Ruta para obtener contenido por categoría
router.get("/contenido/:id_cat", JWT_1.authenticateJWT, plantillas_controller_1.getContentByCategory);
router.get("/contenido/existencia/:id_cat", JWT_1.authenticateJWT, plantillas_controller_1.checkContentExistence);
exports.default = router;
