const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// --- RUTAS PÚBLICAS ---

// Registro de nuevos usuarios
router.post("/register", authController.register);

// Verificación de cuenta por correo electrónico
router.get("/verify", authController.verifyEmail);

// Inicio de sesión (Login)
router.post("/login", authController.login);


// --- RUTAS DE ADMINISTRACIÓN (RBAC) ---

// Obtener todos los usuarios para la tabla visual
router.get("/users", authController.getAllUsers);

// Modificar el rol de un usuario (admin, vendedor, usuario)
router.put("/update-role", authController.updateRole);

module.exports = router;