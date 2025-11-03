// backend/routes/consultas/consultas.js

import express from "express";
import conexion from "../db/conexion.js";


const router = express.Router();

// --- REGISTRO DE CONSULTA ---
router.post("/registro", (req, res) => {
    const { usu_num, pro_cod } = req.body;

    // 1️⃣ Verificar que los datos obligatorios estén presentes
    if (!usu_num || !pro_cod) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    // 2️⃣ SQL para insertar la consulta
    const sql = `
        INSERT INTO consultas (usu_num, pro_cod, fecha_consulta)
        VALUES (?, ?, NOW())
    `;

    // 3️⃣ Ejecutar el query
    const values = [usu_num, pro_cod];

    conexion.query(sql, values, (err, result) => {
        if (err) {
            console.error("❌ Error al registrar consulta:", err);
            return res.status(500).json({ mensaje: "Error al registrar consulta" });
        }

        console.log("✅ Consulta registrada correctamente");
        res.status(201).json({
            mensaje: "Consulta registrada correctamente",
            datos: { usu_num, pro_cod }
        });
    });
});

export default router;
