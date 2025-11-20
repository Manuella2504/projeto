const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ erro: "Token não informado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id_usuario = decoded.id_usuario;
        next();

    } catch (error) {
        return res.status(401).json({ erro: "Token inválido ou expirado" });
    }
};

const authOptional = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.id_usuario = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id_usuario = decoded.id_usuario;
    } catch (err) {
        req.id_usuario = null;
    }

    next();
};

module.exports = { authMiddleware, authOptional };
