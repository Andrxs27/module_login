const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jugando1404@gmail.com",
        pass: "wnyq kwar vgmw glly"
    }
});

// PASO 1: Recibe el correo y envía el link
exports.enviarRecovery = async (req, res) => {
    const { email } = req.body;

    try {
        const resultado = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.json({ message: "Si el correo existe, recibirás un enlace" });
        }

        const usuario = resultado.rows[0];
        const token = uuidv4();

        await pool.query(
            "INSERT INTO change_pass (id, password) VALUES ($1, $2)",
            [token, "pendiente"]
        );

        await pool.query(
            "UPDATE users SET change_pass_id = $1 WHERE id = $2",
            [token, usuario.id]
        );

        const link = `http://localhost:5500/frontend/nueva_password.html?token=${token}`;

        await transporter.sendMail({
            from: "jugando1404@gmail.com",
            to: email,
            subject: "Recupera tu contraseña",
            html: `
                <h2>Hola ${usuario.name}</h2>
                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                <p>Haz clic en el siguiente enlace para crear una nueva:</p>
                <a href="${link}">Restablecer contraseña</a>
                <p>Si no solicitaste esto, puedes ignorar este correo.</p>
            `
        });

        res.json({ message: "Si el correo existe, recibirás un enlace 📧" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// PASO 2: Recibe el token y guarda la nueva contraseña
exports.guardarNuevaPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const resultado = await pool.query(
            "SELECT * FROM users WHERE change_pass_id = $1",
            [token]
        );

        if (resultado.rows.length === 0) {
            return res.status(400).json({ message: "El enlace no es válido o ya fue usado" });
        }

        const usuario = resultado.rows[0];
        const nuevaPasswordEncriptada = await bcrypt.hash(password, 10);

        await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [nuevaPasswordEncriptada, usuario.id]
        );

        await pool.query(
            "UPDATE users SET change_pass_id = NULL WHERE id = $1",
            [usuario.id]
        );

        res.json({ message: "Contraseña actualizada correctamente " });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};