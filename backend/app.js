// backend/app.js
import express from 'express';
import cors from 'cors';
import usuariosRouter from './routes/usuarios.js';
import adminsRouter from './routes/admins.js';

const app = express();

// Permite recibir datos JSON y evitar errores de CORS
app.use(cors());
app.use(express.json());

// Rutas del backend
app.use('/api/usuarios', usuariosRouter);
app.use('/api/admins', adminsRouter);

// Servidor escuchando en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor backend corriendo en http://localhost:3000');
});
