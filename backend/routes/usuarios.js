// backend/routes/usuarios.js
import express from 'express';
import mysql from 'mysql2';

const router = express.Router();

// Configuración de la conexión a MySQL
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'saboruam'
});

// Probar conexión
conexion.connect(err => {
  if (err) console.error(' Error al conectar con MySQL:', err);
  else console.log('Conectado a la base de datos saboruam');
});

// --- REGISTRO DE USUARIO ---
router.post('/registro', (req, res) => {
  const { tipo_de_documento, numero_de_documento, correo_electronico, nombre_completo, contrasena } = req.body;

  if (!tipo_de_documento || !numero_de_documento || !correo_electronico || !nombre_completo || !contrasena) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const sql = `
    INSERT INTO usuario (tipo_de_documento, numero_de_documento, correo_electronico, nombre_completo, contrasena)
    VALUES (?, ?, ?, ?, ?)
  `;

  conexion.query(sql, [tipo_de_documento, numero_de_documento, correo_electronico, nombre_completo, contrasena], (err, result) => {
    if (err) {
      console.error('Error al registrar usuario:', err);
      res.status(500).json({ mensaje: 'Error al registrar usuario' });
    } else {
      res.json({ mensaje: 'Usuario registrado exitosamente' });
    }
  });
});

// --- LOGIN DE USUARIO ---
router.post('/login', (req, res) => {
  const { correo_electronico, contrasena } = req.body;

  const sql = `
    SELECT * FROM usuario
    WHERE correo_electronico = ? AND contrasena = ?
  `;

  conexion.query(sql, [correo_electronico, contrasena], (err, results) => {
    if (err) {
      console.error('Error al iniciar sesión:', err);
      res.status(500).json({ mensaje: 'Error en el servidor' });
    } else if (results.length === 0) {
      res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    } else {
      res.json({ mensaje: 'Inicio de sesión exitoso', usuario: results[0] });
    }
  });
});

export default router;
