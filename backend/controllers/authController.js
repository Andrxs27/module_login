const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// CONFIGURAR CORREO
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
        const userExist = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userExist.rows.length > 0) {
            return res.json({ message: "El correo ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

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

        const verifyLink = `http://localhost:3000/api/verify?id=${id}`;

        await transporter.sendMail({
            from: "jugando1404@gmail.com",
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

// --- INTEGRACIONES NUEVAS ---

// LOGIN 
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (userRes.rows.length === 0) {
            return res.json({ message: "Usuario no encontrado" });
        }

        const user = userRes.rows[0];

        if (!user.active) {
            return res.json({ message: "Debes verificar tu cuenta primero 📧" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: user.id, rol: user.rol }, 
            "palabra_secreta", 
            { expiresIn: "2h" }
        );

        res.json({ 
            message: "Bienvenido",
            token, 
            rol: user.rol, 
            nombre: user.name 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al entrar" });
    }
};

// OBTENER TODOS LOS USUARIOS (Para el administrador)
exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, lastname, email, rol FROM users");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cargar usuarios" });
    }
};

// CAMBIAR EL ROL
exports.updateRole = async (req, res) => {
    const { id, nuevoRol } = req.body;

    try {
        await pool.query("UPDATE users SET rol = $1 WHERE id = $2", [nuevoRol, id]);
        res.json({ message: "Rol actualizado con éxito a " + nuevoRol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar rol" });
    }
};