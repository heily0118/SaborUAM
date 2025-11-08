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
    SELECT 
      p.codigo,
      p.nombre AS nombreProducto,
      p.descripcion,
      p.tipo_menu,
      CONCAT( FORMAT(pl.precio, 0, 'es_CO')) AS precio, 
      pl.estado,
      p.imagen,
      l.nombre AS NOMBRE_LUGAR
    FROM productos p
    LEFT JOIN productos_lugares pl ON p.codigo = pl.pro_cod
    LEFT JOIN lugares l ON pl.lug_nit = l.NIT
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener productos:", err);
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

  console.log("📦 Datos recibidos:", req.body);
  console.log("🖼 Imagen recibida:", req.file);

  // Validar campos obligatorios
  if (!codigo || !nombreProducto || !precio || !NIT) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  // === 1️⃣ Verificar si el producto ya existe solo por código ===
  const sqlVerificar = "SELECT * FROM productos WHERE codigo = ?";
  db.query(sqlVerificar, [codigo], (err, resultados) => {
    if (err) {
      console.error("❌ Error al verificar producto:", err);
      return res.status(500).json({ error: "Error al verificar producto" });
    }

    if (resultados.length > 0) {
      // Ya existe → no se permite registrar de nuevo
      console.log("❌ Error: ya existe un producto con ese código");
      return res.status(400).json({
        error: "Ya existe un producto con ese código. No se puede volver a registrar."
      });
    }

    // === 2️⃣ Insertar producto (solo si no existe) ===
    const sqlInsertarProducto = `
      INSERT INTO productos (codigo, nombre, descripcion, tipo_menu, imagen)
      VALUES (?, ?, ?, ?, ?)
    `;
    const valuesProducto = [
      codigo,
      nombreProducto,
      descripcion,
      tipo_menu,
      imagen
    ];

    db.query(sqlInsertarProducto, valuesProducto, (err) => {
      if (err) {
        console.error("❌ Error al insertar producto:", err);
        return res.status(500).json({ error: "Error al insertar producto" });
      }

      console.log("✅ Producto insertado correctamente");

      // === 3️⃣ Insertar o actualizar relación producto-lugar ===
      const sqlRelacion = `
        INSERT INTO productos_lugares (lug_nit, pro_cod, estado, precio)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          estado = VALUES(estado),
          precio = VALUES(precio)
      `;
      const valuesRelacion = [NIT, codigo, estado || "Disponible", precio];

      db.query(sqlRelacion, valuesRelacion, (err) => {
        if (err) {
          console.error("❌ Error al insertar relación producto-lugar:", err);
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
});

export default router;
