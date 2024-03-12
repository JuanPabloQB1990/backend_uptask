import express from 'express';
import dotenv from 'dotenv'
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
import cors from 'cors'

dotenv.config();

const app = express();

conectarDB()

const whitelist = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function (origin, callback){
        if (whitelist.includes(origin)) {
            callback(null, true)
        }else{
            callback(new Error("error de cors"))
        }
    }
}

app.use(cors(corsOptions))
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