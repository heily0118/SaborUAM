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
  LEFT JOIN lugares l ON pl.lug_nit = l.NIT;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener productos:", err);
      return res.status(500).json({ error: "Error al obtener productos" });
    }

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


// === RUTA POST: registrar producto y relación con lugar (Creación) ===
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

  // === 1️⃣ Verificar si la relación producto-lugar YA existe ===
  const sqlVerificarRelacion = `
    SELECT * FROM productos_lugares 
    WHERE pro_cod = ? AND lug_nit = ?
  `;

  db.query(sqlVerificarRelacion, [codigo, NIT], (err, resultadoRelacion) => {
    if (err) {
      console.error("❌ Error al verificar relación producto-lugar:", err);
      return res.status(500).json({ error: "Error al verificar relación producto-lugar" });
    }

    if (resultadoRelacion.length > 0) {
      // 🚫 Ya existe ese producto en ese lugar
      console.log(`⚠️ El producto ${codigo} ya existe en el lugar ${NIT}.`);
      return res.status(400).json({
        mensaje: "El producto ya existe en este lugar. Actualice el stock manualmente."
      });
    }

    // === 2️⃣ Verificar si el producto existe en la tabla 'productos' ===
    const sqlVerificarProducto = "SELECT * FROM productos WHERE codigo = ?";
    db.query(sqlVerificarProducto, [codigo], (err, resultadosProducto) => {
      if (err) {
        console.error("❌ Error al verificar producto:", err);
        return res.status(500).json({ error: "Error al verificar producto" });
      }

      const stockInicial = parseInt(stock) || 0;

      if (resultadosProducto.length === 0) {
        // 🆕 Producto NO existe → insertarlo en la tabla 'productos'
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

          // Luego crear la relación producto-lugar
          const sqlRelacion = `
            INSERT INTO productos_lugares (lug_nit, pro_cod, estado, precio, stock)
            VALUES (?, ?, ?, ?, ?)
          `;
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
      } else {
        // ✅ Producto ya existe en la tabla productos → solo crear relación
        const sqlRelacion = `
          INSERT INTO productos_lugares (lug_nit, pro_cod, estado, precio, stock)
          VALUES (?, ?, ?, ?, ?)
        `;
        const valuesRelacion = [NIT, codigo, estado || "Disponible", precio, stockInicial];

        db.query(sqlRelacion, valuesRelacion, (err) => {
          if (err) {
            console.error("❌ Error al insertar relación producto-lugar:", err);
            return res.status(500).json({ error: "Error al insertar relación producto-lugar" });
          }

          console.log("✅ Relación producto-lugar creada correctamente");
          res.json({
            mensaje: "Relación producto-lugar creada correctamente"
          });
        });
      }
    });
  });
});



// === RUTA PATCH: Actualizar stock de un producto específico (CORRECCIÓN) ===
// Esta ruta coincide con la solicitud PATCH /api/productos/stock del frontend.
router.patch("/stock", (req, res) => {
  // Nota: No se utiliza multer aquí ya que solo se actualizan datos JSON.
  const { codigo, nit, stock } = req.body;

  // 1. Validar datos
  if (!codigo || !nit || stock === undefined || stock === null) {
    return res.status(400).json({ error: "Faltan datos obligatorios (código, nit, o stock)" });
  }

  const stockInt = parseInt(stock) || 0;
  // Determinar el estado basado en el stock (si stock > 0, Disponible; si stock <= 0, No disponible)
  const nuevoEstado = stockInt > 0 ? 'Disponible' : 'No disponible';

  // 2. Consulta SQL para actualizar 'stock' y 'estado' en productos_lugares
  const sql = `
    UPDATE productos_lugares 
    SET stock = ?, estado = ? 
    WHERE pro_cod = ? AND lug_nit = ?
  `;
  
  db.query(sql, [stockInt, nuevoEstado, codigo, nit], (err, result) => {
    if (err) {
      console.error("❌ Error al actualizar el stock:", err);
      return res.status(500).json({ error: "Error en la base de datos al actualizar el stock" });
    }

    if (result.affectedRows === 0) {
      // Esto sucede si la relación pro_cod y lug_nit no existe
      return res.status(404).json({ error: "No se encontró la relación Producto-Lugar para actualizar." });
    }

    console.log(`✅ Stock de producto ${codigo} en lugar ${nit} actualizado a: ${stockInt}`);
    res.json({ mensaje: "Stock actualizado correctamente", nuevoStock: stockInt, nuevoEstado });
  });
});


export default router;