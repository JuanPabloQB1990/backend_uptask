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

const server = app.listen(PORT, ()=> {
    console.log(`http://localhost:${PORT}`);
})

import { Server } from 'socket.io'

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

io.on("connection", (socket) => {
    console.log("Conectado a socket.io");

    socket.on("abrir proyecto", (proyecto) => {
        socket.join(proyecto)
    })

    socket.on("nueva tarea", (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit("tarea agregada", tarea)
    })

    socket.on("eliminar tarea", (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit("tarea eliminada", tarea)
    })

    socket.on("actualizar tarea", (tarea) => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit("tarea actualizada", tarea)
    })

    socket.on("cambiar estado", (tarea) => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit("nuevo estado", tarea)
    })

})