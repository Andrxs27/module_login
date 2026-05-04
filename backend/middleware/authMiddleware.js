const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: "Token requerido" });

    jwt.verify(token.split(" ")[1], "SECRETO_SUPER_SEGURO", (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token inválido o expirado" });
        req.user = decoded; // Aquí guardamos el ID y el ROL que vienen en el token
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ message: "Acceso denegado: Se requiere ser Administrador" });
    }
    next();
};

module.exports = { verifyToken, isAdmin };