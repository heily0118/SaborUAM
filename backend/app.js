// backend/app.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import productosRouter from "./routes/productos.js";
import usuariosRouter from "./routes/usuarios.js";
import lugaresRouter from "./routes/lugares.js";

// ===> 🔧 Solución al error de __dirname y __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuración general
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "70mb" }));
app.use(express.json({ limit: "70mb" }));

// Servir imágenes estáticas desde la carpeta uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas de la aplicación
app.use("/api/productos", productosRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/lugares", lugaresRouter);

// Servidor corriendo
app.listen(3000, () => {
  console.log("✅ Servidor backend corriendo en http://localhost:3000");
});
