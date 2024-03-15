import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, name, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transport.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Bienvenido a Uptask - Comprueba tu Cuenta",
    text: `Comprueba tu cuenta`,
    html: `<p>Hola ${name}, gracias por registrarte en Uptask. Para confirmar tu cuenta haz click en el siguiente enlace: </p>
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
                <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `,
  });

  console.log(info);
};

export const emailOlvidePassord = async (datos) => {
  const { email, name, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" uptask@example.com',
    to: email,
    subject: "Bienvenido a Uptask - Recupera tu password",
    text: `Comprueba tu cuenta`,
    html: `<p>Hola ${name}, Para Recuperar tu password haz click en el siguiente enlace: </p>
               <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Recuperar password</a>
               <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
        `,
  });
};
