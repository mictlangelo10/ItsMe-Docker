"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const usuario_routes_1 = __importDefault(require("./routes/usuario.routes"));
const categoria_routes_1 = __importDefault(require("./routes/categoria.routes"));
const plantillas_routes_1 = __importDefault(require("./routes/plantillas.routes"));
const bodyParser = require("body-parser");
const app = (0, express_1.default)();
// Configurar Helmet para mejorar la seguridad
app.use((0, helmet_1.default)());
// Aumentar el límite de tamaño a 10 MB, por ejemplo
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
// Middlewares
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({ origin: "http://localhost:4200" })); // Permitir solicitudes desde localhost:4200
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Rutas
app.use("/api/usuarios", usuario_routes_1.default);
app.use("/api", categoria_routes_1.default);
app.use("/api", plantillas_routes_1.default);
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
});
