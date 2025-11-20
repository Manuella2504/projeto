const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        if (!email || !senha) {
            return res.status(400).json({ erro: "Email e senha são obrigatórios." });
        }

        const [rows] = await db.query(
            "SELECT * FROM usuarios WHERE email_usuario = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ erro: "Email não encontrado." });
        }

        const usuario = rows[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_usuario);
        if (!senhaCorreta) {
            return res.status(400).json({ erro: "Senha incorreta." });
        }

        const token = jwt.sign(
            { id_usuario: usuario.id_usuario },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            mensagem: "Login realizado com sucesso",
            usuario: {
                id_usuario: usuario.id_usuario,
                nome_usuario: usuario.nome_usuario,
                email_usuario: usuario.email_usuario,
                avatar_url: usuario.avatar_url
            },
            token
        });

    } catch (error) {
        return res.status(500).json({ erro: "Erro no servidor" });
    }
};
