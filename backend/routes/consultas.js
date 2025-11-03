// backend/routes/consultas.js
import express from 'express';
import conexion from '../db/conexion.js';

const router = express.Router();

// --- REGISTRO DE CONSULTA ---
router.post('/registro', (req, res) => {
  const { usu_num, pro_cod } = req.body;

  if (!usu_num || !pro_cod) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  const sql = `
    INSERT INTO consultas (usu_num, pro_cod)
    VALUES (?, ?)
  `;

  conexion.query(sql, [usu_num, pro_cod], (err) => {
    if (err) {
      console.error('❌ Error al registrar consulta:', err);
      res.status(500).json({ mensaje: 'Error al registrar consulta' });
    } else {
      console.log('✅ Consulta registrada correctamente');
      res.json({ mensaje: 'Consulta registrada correctamente' });
    }
  });
});

export default router;
