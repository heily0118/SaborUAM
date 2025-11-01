// backend/app.js
import express from 'express';
import cors from 'cors';
import productosRouter from './routes/productos.js';
import usuariosRouter from './routes/usuarios.js';
import lugaresRouter from './routes/lugares.js';

const app = express();

// Configuración general
app.use(cors());
app.use(express.json());

// Rutas de la aplicación
app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/lugares', lugaresRouter);

// Servidor corriendo
app.listen(3000, () => {
  console.log(' Servidor backend corriendo en http://localhost:3000');
});
