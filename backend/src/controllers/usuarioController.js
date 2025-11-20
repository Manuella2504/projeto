const db = require("../config/database");

exports.listar = async (req, res) => {
    try {
        const [usuarios] = await db.query(
            "SELECT id_usuario, nome_usuario, email_usuario, avatar_url FROM usuarios"
        );
        return res.json(usuarios);
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao listar usuários." });
    }
};

exports.perfil = async (req, res) => {
    const id_usuario = req.id_usuario;

    try {
        const [user] = await db.query(
            "SELECT id_usuario, nome_usuario, email_usuario, avatar_url FROM usuarios WHERE id_usuario = ?",
            [id_usuario]
        );

        if (user.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        const usuario = user[0];

        const [stats] = await db.query(
            `SELECT 
                COUNT(*) AS total_atividades,
                IFNULL(SUM(CAST(calorias AS SIGNED)), 0) AS total_calorias
             FROM atividades
             WHERE id_usuario = ?`,
            [id_usuario]
        );

        return res.json({
            id_usuario: usuario.id_usuario,
            nome_usuario: usuario.nome_usuario,
            email_usuario: usuario.email_usuario,
            avatar_url: usuario.avatar_url,
            total_atividades: stats[0].total_atividades,
            total_calorias: stats[0].total_calorias
        });

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao carregar perfil." });
    }
};

exports.buscarPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const [user] = await db.query(
            "SELECT id_usuario, nome_usuario, email_usuario, avatar_url FROM usuarios WHERE id_usuario = ?",
            [id]
        );

        if (user.length === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        return res.json(user[0]);
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao buscar usuário." });
    }
};

exports.atualizar = async (req, res) => {
    const { id } = req.params;
    const { nome_usuario, email_usuario, avatar_url } = req.body;

    try {
        await db.query(
            `UPDATE usuarios
             SET nome_usuario = ?, email_usuario = ?, avatar_url = ?
             WHERE id_usuario = ?`,
            [nome_usuario, email_usuario, avatar_url, id]
        );

        return res.json({ mensagem: "Usuário atualizado com sucesso." });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao atualizar usuário." });
    }
};

exports.deletar = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);
        return res.json({ mensagem: "Usuário deletado com sucesso." });
    } catch (error) {
        return res.status(500).json({ erro: "Erro ao deletar usuário." });
    }
};
const bcrypt = require("bcrypt");

exports.cadastrar = async (req, res) => {
    const { nome_usuario, email_usuario, senha_usuario, avatar_url } = req.body;

    if (!nome_usuario || !email_usuario || !senha_usuario) {
        return res.status(400).json({ erro: "Preencha todos os campos obrigatórios." });
    }

    try {
        const [existe] = await db.query(
            "SELECT id_usuario FROM usuarios WHERE email_usuario = ?",
            [email_usuario]
        );

        if (existe.length > 0) {
            return res.status(400).json({ erro: "Email já cadastrado." });
        }

        const hash = await bcrypt.hash(senha_usuario, 10);

        await db.query(
            `INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario, avatar_url)
             VALUES (?, ?, ?, ?)`,
            [nome_usuario, email_usuario, hash, avatar_url || null]
        );

        return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso." });

    } catch (e) {
        return res.status(500).json({ erro: "Erro ao cadastrar usuário." });
    }
};
