import Proyecto from "../models/Proyectos.js";
import Tarea from "../models/Tareas.js";
import Usuario from "../models/Usuario.js";

export const obtenerProyectos = async(req, res) => {

  const proyectos = await Proyecto.find({
    $or: [
      { colaboradores: { $in: req.usuario}},
      { creador: { $in: req.usuario}},
    ]
  }).select('-tareas')
  
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
  const proyecto = await Proyecto.findById(id).populate({path: "tareas", populate: {path:"completado", select: "name"}}).populate("colaboradores", "name email")
    
  if (!proyecto) {
    const error = new Error("Proyecto no encontrado")
    return res.status(404).json({msg: error.message})
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
    const error = new Error("Accion no valida")
    return res.status(401).json({msg: error.message})
  }
  
  res.json(proyecto)
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

export const buscarColaborador = async(req, res) => {
  
  const { email } = req.body

  const usuario = await Usuario.findOne({email}).select("-confirmado -updatedAt -createdAt -password -token --update -__v")

  if (!usuario) {
    const error = new Error("Usuario no encontrado")
    return res.status(404).json({msg: error.message})
  }

  res.json(usuario)
}

export const agregarColaborador = async(req, res) => {
  
  const proyecto = await Proyecto.findById(req.params.id)
  
  if (!proyecto) {
    const error = new Error("Proyecto no encontrado")
    return res.status(404).json({msg: error.message})
  }
  
  // verificar que el que agrega sea el admin del proyecto
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida")
    return res.status(401).json({msg: error.message})
  }

  const { email } = req.body

  const usuario = await Usuario.findOne({email}).select("-confirmado -updatedAt -createdAt -password -token --update -__v")

  // verificar si el usuario existe
  if (!usuario) {
    const error = new Error("Usuario no encontrado")
    return res.status(404).json({msg: error.message})
  }

  // el colaborador no sea el admin del proyecto
  if (proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error("El creador del proyecto no puede ser Colaborador")
    return res.status(401).json({msg: error.message})
  }

  //que el usuario no este agregado ya al proyecto
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error("El Usuario ya pertenece a este proyecto")
    return res.status(404).json({msg: error.message})
  }

  proyecto.colaboradores.push(usuario._id)
  await proyecto.save()

  res.json({ msg: "Colaborador agregado"})
}

export const eliminarColaborador = async(req, res) => {

  const proyecto = await Proyecto.findById(req.params.id)
  
  if (!proyecto) {
    const error = new Error("Proyecto no encontrado")
    return res.status(404).json({msg: error.message})
  }
  
  // verificar que el que agrega sea el admin del proyecto
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida")
    return res.status(401).json({msg: error.message})
  }

  const { id } = req.body

  proyecto.colaboradores.pull(id)
  
  await proyecto.save()

  res.json({ msg: "Colaborador Eliminado"})
}


