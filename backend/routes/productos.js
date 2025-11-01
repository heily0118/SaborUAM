// backend/routes/productos.js
import express from "express";
import db from "../db/conexion.js"; // la conexión que hicimos antes
const router = express.Router();

// Obtener todos los productos
router.get("/", (req, res) => {
  const sql = "SELECT * FROM producto";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      return res.status(500).json({ error: "Error al obtener los productos" });
    }
    res.json(result);
  });
});

export default router;
