import express from "express";
import multer from "multer";
import db from "../db/conexion.js";

const router = express.Router();
const upload = multer(); // leer FormData sin archivos

// Registrar un nuevo lugar (ahora con 'dias')
router.post("/registro", upload.none(), (req, res) => {
  const {
    NIT,
    nombre,
    tipo,
    horario,
    estado,
    servicioDomicilio,
    numeroContacto,
    ubicacion,
    dias // <--- agregar aquí
  } = req.body;

  console.log("Datos recibidos:", req.body);

  // Validar campos obligatorios
  if (!NIT || !nombre || !tipo) {
    return res.status(400).json({ mensaje: "NIT, nombre y tipo son obligatorios" });
  }

  const servicio = servicioDomicilio === "Sí" ? 1 : 0;

  const sql = `
    INSERT INTO lugares 
    (NIT, nombre, tipo, horario_atencion, estado, servicio_domicilio, numero_contacto_domicilio, ubicacion, dias)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      nombre = VALUES(nombre),
      tipo = VALUES(tipo),
      horario_atencion = VALUES(horario_atencion),
      estado = VALUES(estado),
      servicio_domicilio = VALUES(servicio_domicilio),
      numero_contacto_domicilio = VALUES(numero_contacto_domicilio),
      ubicacion = VALUES(ubicacion),
      dias = VALUES(dias)
  `;

  const values = [NIT, nombre, tipo, horario, estado, servicio, numeroContacto, ubicacion, dias];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error al registrar lugar:", err);
      return res.status(500).json({ mensaje: "Error al registrar lugar" });
    }

    console.log("Lugar insertado/actualizado correctamente");
    res.json({ mensaje: "Lugar registrado exitosamente", NIT });
  });
});

export default router;
