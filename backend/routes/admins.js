// routes/admins.js
import express from 'express';
const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({ mensaje: 'Ruta de admins funcionando' });
});

export default router;
