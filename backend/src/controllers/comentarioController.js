const db = require("../config/database");
const dayjs = require("dayjs");

exports.criar = async (req, res) => {
    const id_usuario = req.id_usuario;
    const id_atividade = req.params.id;
    const { texto } = req.body;

    try {
        if (!texto || texto.trim().length < 1) {
            return res.status(400).json({ erro: "Comentário inválido." });
        }

        const [atividade] = await db.query(
            "SELECT id_atividade FROM atividades WHERE id_atividade = ?",
            [id_atividade]
        );

        if (atividade.length === 0) {
            return res.status(404).json({ erro: "Atividade não encontrada." });
        }

        const [result] = await db.query(
            `INSERT INTO comentarios (id_usuario, id_atividade, texto, data_criacao)
             VALUES (?, ?, ?, NOW())`,
            [id_usuario, id_atividade, texto]
        );

        const [dados] = await db.query(
            `SELECT 
                c.id_comentario,
                c.texto,
                c.data_criacao,
                u.id_usuario,
                u.nome_usuario,
                u.avatar_url
            FROM comentarios c
            JOIN usuarios u ON u.id_usuario = c.id_usuario
            WHERE c.id_comentario = ?`,
            [result.insertId]
        );

        const c = dados[0];

        return res.status(201).json({
            id_comentario: c.id_comentario,
            texto: c.texto,
            data_criacao: dayjs(c.data_criacao).format("HH:mm - DD/MM/YY"),
            usuario: {
                id_usuario: c.id_usuario,
                nome_usuario: c.nome_usuario,
                avatar_url: c.avatar_url
            }
        });

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao criar comentário." });
    }
};


exports.listarPorAtividade = async (req, res) => {
    const id_atividade = req.params.id;

    try {
        const [comentarios] = await db.query(
            `SELECT 
                c.id_comentario,
                c.texto,
                c.data_criacao,
                u.id_usuario,
                u.nome_usuario,
                u.avatar_url
            FROM comentarios c
            JOIN usuarios u ON u.id_usuario = c.id_usuario
            WHERE c.id_atividade = ?
            ORDER BY c.id_comentario DESC`,
            [id_atividade]
        );

        const lista = comentarios.map(c => ({
            id_comentario: c.id_comentario,
            texto: c.texto,
            data_criacao: dayjs(c.data_criacao).format("HH:mm - DD/MM/YY"),
            usuario: {
                id_usuario: c.id_usuario,
                nome_usuario: c.nome_usuario,
                avatar_url: c.avatar_url
            }
        }));

        return res.json(lista);

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao listar comentários." });
    }
};
