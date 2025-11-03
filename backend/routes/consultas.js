
// backend/routes/consultas/consultas.js

import express from 'express';
import db from "../db/conexion.js";

const router = express.Router();

// --- REGISTRO DE CONSULTA ---
router.post('/registro', (req, res) => {
    const { usu_num, pro_cod } = req.body;

    // 1. Verificación de datos
    if (!usu_num || !pro_cod) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    // 2. CONSTRUCCIÓN CORRECTA DEL SQL
    // CORRECCIÓN 1: La tabla y las columnas deben ir separadas y entre comillas invertidas o sin ellas.
    // CORRECCIÓN 2: Se incluye la columna de fecha (CON_FECHA) con el valor de NOW().
    const sql = `
        INSERT INTO consultas (USU_NUM, PRO_COD, CON_FECHA) 
        VALUES (?, ?, NOW())
    `;
    
    // CORRECCIÓN 3: El array de valores solo debe contener los datos que reemplazarán a los '?'
    const values = [usu_num, pro_cod];

    conexion.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al registrar consulta:', err);
            // Si quieres ser específico con el error (ej: clave foránea)
            // if (err.code === 'ER_NO_REFERENCED_ROW_2') { ... }
            return res.status(500).json({ mensaje: 'Error al registrar consulta' });
        } else {
            console.log('Consulta registrada correctamente');
            res.status(201).json({ 
                mensaje: 'Consulta registrada correctamente',
                id: result.insertId // Es útil devolver el ID insertado
            });
        }
    });
});

export default router;
