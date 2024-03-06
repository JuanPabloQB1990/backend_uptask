import express from 'express';
import dotenv from 'dotenv'
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';

dotenv.config();

const app = express();

conectarDB()

// Routing

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes);

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
    console.log(`http://localhost:${PORT}`);
})