// backend/routes/productos.js
import express from "express";
import db from "../db/conexion.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

// Configurar multer
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Obtener todos los productos
router.get("/", (req, res) => {
  const sql = "SELECT * FROM productos";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      return res.status(500).json({ error: "Error al obtener los productos" });
    }
    res.json(result);
  });
});

// Crear nuevo producto
router.post("/", upload.single('imagen'), (req, res) => {
  try {
    const { codigo, nombreProducto, descripcion, tipo_menu, precio } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No se subió ninguna imagen" });
    }

    const imagen = req.file.filename;

    const sql = `
      INSERT INTO productos (codigo, nombre, descripcion, tipo_menu, precio, imagen)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [codigo, nombreProducto, descripcion, tipo_menu, precio, imagen];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error al insertar producto:", err);
        return res.status(500).json({ error: "Error al guardar el producto" });
      }
      res.json({ mensaje: "Producto guardado correctamente", id: result.insertId });
    });
  } catch (error) {
    console.error("Error en POST /productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
