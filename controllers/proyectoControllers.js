import Proyecto from "../models/Proyectos.js";
import Tarea from "../models/Tareas.js";

export const obtenerProyectos = async(req, res) => {

  const proyectos = await Proyecto.find().where('creador').equals(req.usuario)
  
  res.json(proyectos)
}

export const nuevoProyecto = async(req, res) => {
  const proyecto = new Proyecto(req.body)
  proyecto.creador = req.usuario._id

  try {
    const proyectoAlmacenado = await proyecto.save()
    res.json(proyectoAlmacenado)
  } catch (error) {
    console.log(error);
  }
}

export const obtenerProyecto = async(req, res) => {

  const { id } = req.params
  const proyecto = await Proyecto.findById(id)
    
  if (!proyecto) {
    const error = new Error("Proyecto no encontrado")
    return res.status(404).json({msg: error.message})
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida")
    return res.status(401).json({msg: error.message})
  }

  const tareas = await Tarea.find().where("proyecto").equals(proyecto._id)

  res.json({
    proyecto,
    tareas
  })
}

export const editarProyecto = async(req, res) => {
    const { id } = req.params
    const proyecto = await Proyecto.findById(id)
      
    if (!proyecto) {
      const error = new Error("Proyecto no encontrado")
      return res.status(404).json({msg: error.message})
    }
  
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Accion no valida")
      return res.status(401).json({msg: error.message})
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente
  
    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error);
    }
    
}

export const eliminarProyecto = async(req, res) => {
    const { id } = req.params
    const proyecto = await Proyecto.findById(id)
      
    if (!proyecto) {
      const error = new Error("Proyecto no encontrado")
      return res.status(404).json({msg: error.message})
    }
  
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Accion no valida")
      return res.status(401).json({msg: error.message})
    }

    try {
        await proyecto.deleteOne()
        res.json({msg: "Proyecto eliminado"})
    } catch (error) {
        console.log(error);
    }
}

export const agregarColaborador = async(req, res) => {
  
}

export const eliminarColaborador = async(req, res) => {
  
}


