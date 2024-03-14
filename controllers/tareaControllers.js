import Proyecto from "../models/Proyectos.js";
import Tarea from "../models/Tareas.js";

export const agregarTarea = async (req, res) => {
  const { proyecto } = req.body;
  const existeProyecto = await Proyecto.findById(proyecto);

  console.log(existeProyecto);

  if (!existeProyecto) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.msg });
  }

  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permisos para agregar tareas");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    // almacenar id del proyecto
    existeProyecto.tareas.push(tareaAlmacenada._id);
    await existeProyecto.save();
    
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

export const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("La tarea no existe");
    return res.status(404).json({ msg: error.msg });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  res.json(tarea);
};

export const actualizarTarea = async(req, res) => {
  const { id } = req.params;
  
  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("La tarea no existe");
    return res.status(404).json({ msg: error.msg });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.nombre = req.body.nombre || tarea.nombre
  tarea.descripcion = req.body.descripcion || tarea.descripcion
  tarea.prioridad = req.body.prioridad || tarea.prioridad
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega

  try {
    const tareaAlmacenada = await tarea.save()
    res.json(tareaAlmacenada)
  } catch (error) {
    console.log(error);
  }
};

export const eliminarTarea = async(req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");
  
    if (!tarea) {
      const error = new Error("La tarea no existe");
      return res.status(404).json({ msg: error.msg });
    }
  
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Accion no valida");
      return res.status(403).json({ msg: error.message });
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)

        // eliminar tarea y las tarea del proyecto al mismo tiempo
        await Promise.allSettled([await tarea.deleteOne(), await tarea.deleteOne(), await proyecto.save()])
        
        res.json({msg: "Tarea eliminada"})
    } catch (error) {
        console.log(error);
    }
};

export const cambiarEstado = async(req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("La tarea no existe");
    return res.status(404).json({ msg: error.msg });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()  && !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.estado = !tarea.estado
  await tarea.save()
  res.json(tarea)


};
