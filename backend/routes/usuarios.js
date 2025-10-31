import express from 'express';
const router = express.Router();

// Rutas de prueba
router.post('/login', (req, res) => {
  console.log('Login recibido:', req.body);
  res.json({ mensaje: '¡Login recibido correctamente!' });
});

router.post('/registro', (req, res) => {
  console.log('Registro recibido:', req.body);
  res.json({ mensaje: '¡Registro recibido correctamente!' });
});

export default router;
