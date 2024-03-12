import { emailOlvidePassord, emailRegistro } from "../helpers/emails.js";
import { generarId } from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Usuario from "../models/Usuario.js";

export const registrar = async (req, res) => {
  // evitar registros duplicados
  const { email } = req.body;

  const usuarioExiste = await Usuario.findOne({ email });

  if (usuarioExiste) {
    const error = new Error("Este usuario ya esta registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    await usuario.save();

    // enviar email de confirmacion
    emailRegistro({
      name: usuario.name,
      email: usuario.email,
      token: usuario.token,
    })
    res.json({msg: "Usuario Registrado correctamente, revisa tu email para confirmar tu cuenta"});
  } catch (error) {
    console.log(error);
  }
};

export const autenticar = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no esta registrado");
    return res.status(404).json({ msg: error.message });
  }

  if (!usuario.confirmado) {
    const error = new Error("El usuario no esta confirmado");
    return res.status(403).json({ msg: error.message });
  }

  // comprobar password
  if (await usuario.comprobarPassword(password)) {
    return res.json({
      _id: usuario._id,
      name: usuario.name,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};

export const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Usuario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("El token no es valido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    console.log(usuarioConfirmar);
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();

    res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

export const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuairo no esta registrado");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();

    // enviar email para recuperar password
    emailOlvidePassord({
      name: usuario.name,
      email: usuario.email,
      token: usuario.token,
    })

    res.json({ msg: "Te hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

export const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Usuario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "Token valido" });
  } else {
    const error = new Error("El token no es valido");
    return res.status(400).json({ msg: error.message });
  }
};

export const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });

  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    await usuario.save();
    res.json({ msg: "password modificado correctamente" });
  } else {
    const error = new Error("El token no es valido");
    return res.status(404).json({ msg: error.message });
  }
};

export const perfil = (req, res) => {
  const { usuario } = req;

  res.json(usuario);
};
