// backend/routes/lugares.js
import express from "express";
import db from "../db/conexion.js";

const router = express.Router();

// Obtener todos los lugares
router.get("/", (req, res) => {
  const sql = "SELECT * FROM lugares"; 
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener lugares:", err);
      return res.status(500).json({ mensaje: "Error al obtener lugares" });
    }
    res.json(results);
  });
});

// Registrar un nuevo lugar
router.post("/registro", (req, res) => {
  const { nombre, direccion, descripcion } = req.body;

  if (!nombre || !direccion || !descripcion) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO lugares (nombre, direccion, descripcion) VALUES (?, ?, ?)";
  db.query(sql, [nombre, direccion, descripcion], (err, result) => {
    if (err) {
      console.error("Error al registrar lugar:", err);
      return res.status(500).json({ mensaje: "Error al registrar lugar" });
    }
    res.json({ mensaje: "Lugar registrado exitosamente", id: result.insertId });
  });
});

export default router;
