const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

// CONFIGURAR CORREO (CAMBIA ESTO)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jugando1404@gmail.com",
        pass: "wnyq kwar vgmw glly"
    }
});

// REGISTRO
exports.register = async (req, res) => {
    const {
        nombre, lastname, email, password,
        document, type_document, phone,
        address, age, departamento, ciudad,
        sexo, born
    } = req.body;

    try {
        // Verificar si ya existe
        const userExist = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userExist.rows.length > 0) {
            return res.json({ message: "El correo ya está registrado" });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const id = uuidv4();

        // Guardar usuario (inactivo)
        await pool.query(
            `INSERT INTO users 
            (id, name, lastname, email, password, document, type_document, phone, address, age, departamento, ciudad, sexo, born, active)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
            [
                id, nombre, lastname, email, hashedPassword,
                document, type_document, phone, address,
                age, departamento, ciudad, sexo, born, false
            ]
        );

        // LINK DE VERIFICACIÓN
        const verifyLink = `http://localhost:3000/api/verify?id=${id}`;

        //  ENVIAR CORREO
        await transporter.sendMail({
            from: "TU_CORREO@gmail.com",
            to: email,
            subject: "Verifica tu cuenta",
            html: `
                <h2>Hola ${nombre}</h2>
                <p>Haz click para verificar tu cuenta:</p>
                <a href="${verifyLink}">Verificar cuenta</a>
            `
        });

        res.json({ message: "Usuario registrado. Revisa tu correo 📧" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// VERIFICAR EMAIL
exports.verifyEmail = async (req, res) => {
    const { id } = req.query;

    try {
        await pool.query(
            "UPDATE users SET active = true WHERE id = $1",
            [id]
        );

        res.send("Cuenta verificada correctamente 🎉");

    } catch (error) {
        console.error(error);
        res.send("Error al verificar");
    }
};