
import express from 'express';
import conexion from '../db/conexion.js';

const router = express.Router();

// --- REGISTRO DE CONSULTA ---
router.post('/registro', (req, res) => {
    const { usu_num, pro_cod } = req.body;

    // 1. Verificación de datos
    if (!usu_num || !pro_cod) {
        return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    // 2. CONSTRUCCIÓN CORRECTA DEL SQL
    const sql = `
        INSERT INTO consultas (USU_NUM, PRO_COD, FECHA_CONSULTA) 
        VALUES (?, ?, NOW())
    `;
    
    const values = [usu_num, pro_cod];

    conexion.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al registrar consulta:', err);
            return res.status(500).json({ mensaje: 'Error al registrar consulta' });
        } else {
            console.log('Consulta registrada correctamente');
            res.status(201).json({ 
                mensaje: 'Consulta registrada correctamente',
                id: result.insertId 
            });
        }
    });
});

export default router;
