// routes/productos.js
import express from "express";
import multer from "multer";
import path from "path";
import db from "../db/conexion.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

// === Configuración de subida de imágenes ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const upload = multer({ dest: path.join(__dirname, "../uploads") });

// === RUTA GET: obtener todos los productos con su lugar ===
router.get("/", (req, res) => {
  const sql = `
    SELECT p.codigo,
           p.nombre AS nombreProducto,
           p.descripcion,
           p.tipo_menu,
           p.precio,
           p.imagen,
          TRIM(p.estado) AS estado,
           l.nombre AS NOMBRE_LUGAR
    FROM productos p
    LEFT JOIN productos_lugares pl ON p.codigo = pl.pro_cod
    LEFT JOIN lugares l ON pl.lug_nit = l.NIT
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      return res.status(500).json({ error: "Error al obtener productos" });
    }
    res.json(results);
  });
});

// === RUTA POST: registrar producto y relación con lugar ===
router.post("/", upload.single("imagen"), (req, res) => {
  const {
    codigo,
    nombreProducto,
    descripcion,
    tipo_menu,
    precio,
    NIT,
    estado
  } = req.body;

  const imagen = req.file ? req.file.filename : null;

  console.log("📦 Datos recibidos del producto:", req.body);
  console.log("🖼 Archivo recibido:", req.file);

  // Validar campos obligatorios
  if (!codigo || !nombreProducto || !precio || !NIT) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  // === Insertar o actualizar producto ===
  const sqlProducto = `
    INSERT INTO productos (codigo, nombre, descripcion, tipo_menu, precio, imagen, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      nombre = VALUES(nombre),
      descripcion = VALUES(descripcion),
      tipo_menu = VALUES(tipo_menu),
      precio = VALUES(precio),
      imagen = VALUES(imagen),
      estado = VALUES(estado)
  `;

  // Si no se envía estado, por defecto queda 'Disponible'
  const valuesProducto = [
    codigo,
    nombreProducto,
    descripcion,
    tipo_menu,
    precio,
    imagen,
    estado || "Disponible"
  ];

  db.query(sqlProducto, valuesProducto, (err) => {
    if (err) {
      console.error("Error al insertar producto:", err);
      return res.status(500).json({ error: "Error al insertar producto" });
    }

    console.log("✅ Producto insertado/actualizado correctamente");

    // === Insertar o actualizar relación producto-lugar ===
    const sqlRelacion = `
      INSERT INTO productos_lugares (lug_nit, pro_cod)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE lug_nit = VALUES(lug_nit)
    `;
    const valuesRelacion = [NIT, codigo];

    db.query(sqlRelacion, valuesRelacion, (err) => {
      if (err) {
        console.error("Error al insertar relación producto-lugar:", err);
        return res
          .status(500)
          .json({ error: "Error al insertar relación producto-lugar" });
      }

      console.log("✅ Relación producto-lugar creada correctamente");
      res.json({
        mensaje: "Producto y relación insertados correctamente"
      });
    });
  });
});

export default router;
