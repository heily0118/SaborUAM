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


// === RUTA GET: obtener productos con su información de lugar ===
router.get("/", (req, res) => {
  const sql = `
SELECT
  p.codigo,
  p.nombre AS nombreProducto,
  p.descripcion,
  p.tipo_menu,
  pl.precio,
  pl.stock, 
  pl.estado,
  p.imagen,
  l.NIT,
  l.nombre AS nombreLugar,
  l.tipo,
  l.horario_atencion,
  l.estado AS estadoLugar,
  l.servicio_domicilio,
  l.numero_contacto_domicilio,
  l.ubicacion,
  l.dias
FROM productos p
LEFT JOIN productos_lugares pl ON p.codigo = pl.pro_cod
LEFT JOIN lugares l ON pl.lug_nit = l.NIT


  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener productos:", err);
      return res.status(500).json({ error: "Error al obtener productos" });
    }

    // 🧩 Reformatear cada fila para separar producto y lugar
    const productos = results.map(row => ({
      codigo: row.codigo,
      nombreProducto: row.nombreProducto,
      descripcion: row.descripcion,
      tipo_menu: row.tipo_menu,
      estado: row.estado,
      imagen: row.imagen,
      lugar: {
        NIT: row.NIT,
        nombre: row.nombreLugar,
        tipo: row.tipo,
        horario_atencion: row.horario_atencion,
        estado: row.estadoLugar,
        servicio_domicilio: row.servicio_domicilio,
        numero_contacto_domicilio: row.numero_contacto_domicilio,
        ubicacion: row.ubicacion,
        dias: row.dias,
        stock: row.stock,
        precio: row.precio 
      }
    }));


    res.json(productos);
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
    estado,
    stock, // Recibimos el stock también
  } = req.body;

  const imagen = req.file ? req.file.filename : null;

  // Validar campos obligatorios
  if (!codigo || !nombreProducto || !precio || !NIT || stock === undefined) {
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
    const valuesProducto = [codigo, nombreProducto, descripcion, tipo_menu, imagen];

    db.query(sqlInsertarProducto, valuesProducto, (err) => {
      if (err) {
        console.error("❌ Error al insertar producto:", err);
        return res.status(500).json({ error: "Error al insertar producto" });
      }

      console.log("✅ Producto insertado correctamente");

      // === 3️⃣ Insertar o actualizar relación producto-lugar ===
      const sqlRelacion = `
        INSERT INTO productos_lugares (lug_nit, pro_cod, estado, precio, stock)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          estado = VALUES(estado),
          precio = VALUES(precio),
          stock = VALUES(stock)
      `;

      // Asegurarnos de que el stock esté en formato entero
      const stockInicial = parseInt(stock) || 0;
      const valuesRelacion = [NIT, codigo, estado || "Disponible", precio, stockInicial];

      db.query(sqlRelacion, valuesRelacion, (err) => {
        if (err) {
          console.error("❌ Error al insertar relación producto-lugar:", err);
          return res.status(500).json({ error: "Error al insertar relación producto-lugar" });
        }

        console.log("✅ Relación producto-lugar creada correctamente");
        res.json({
          mensaje: "Producto y relación insertados correctamente"
        });
      });
    });
  });
});


// === RUTA PATCH: actualizar stock de un producto específico ===
router.post("/", upload.single("imagen"), (req, res) => {
  const { codigo, nombreProducto, descripcion, tipo_menu, precio, NIT, stock } = req.body;
  const imagen = req.file ? req.file.filename : null;

  if (!codigo || !nombreProducto || !precio || !NIT || stock === undefined) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const stockInt = parseInt(stock) || 0;
  const estado = stockInt > 0 ? "Disponible" : "No disponible";

  // Verificar si el producto existe
  const sqlVerificarProducto = "SELECT * FROM productos WHERE codigo = ?";
  db.query(sqlVerificarProducto, [codigo], (err, resultados) => {
    if (err) return res.status(500).json({ error: "Error al verificar producto" });

    const productoExiste = resultados.length > 0;

    if (!productoExiste) {
      // Insertar producto primero
      const sqlInsertarProducto = `
        INSERT INTO productos (codigo, nombre, descripcion, tipo_menu, imagen)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(sqlInsertarProducto, [codigo, nombreProducto, descripcion, tipo_menu, imagen], (err) => {
        if (err) return res.status(500).json({ error: "Error al insertar producto" });

        // Insertar relación
        const sqlRelacion = `
          INSERT INTO productos_lugares (lug_nit, pro_cod, estado, precio, stock)
          VALUES (?, ?, ?, ?, ?)
        `;
        db.query(sqlRelacion, [NIT, codigo, estado, precio, stockInt], (err) => {
          if (err) return res.status(500).json({ error: "Error al insertar relación producto-lugar" });
          res.json({ mensaje: "Producto y relación insertados correctamente" });
        });
      });
    } else {
      // Revisar si ya existe la relación producto-lugar
      const sqlVerificarRelacion = "SELECT * FROM productos_lugares WHERE pro_cod = ? AND lug_nit = ?";
      db.query(sqlVerificarRelacion, [codigo, NIT], (err, rel) => {
        if (err) return res.status(500).json({ error: "Error al verificar relación producto-lugar" });

        if (rel.length > 0) {
          // Producto y lugar ya existen → sugerir actualizar stock
          return res.status(400).json({
            error: "Este producto ya existe en este lugar. Por favor actualiza el stock desde la sección correspondiente."
          });
        } else {
          // Insertar nueva relación
          const sqlRelacion = `
            INSERT INTO productos_lugares (lug_nit, pro_cod, estado, precio, stock)
            VALUES (?, ?, ?, ?, ?)
          `;
          db.query(sqlRelacion, [NIT, codigo, estado, precio, stockInt], (err) => {
            if (err) return res.status(500).json({ error: "Error al insertar relación producto-lugar" });
            res.json({ mensaje: "Producto agregado a este lugar correctamente" });
          });
        }
      });
    }
  });
});


export default router;
