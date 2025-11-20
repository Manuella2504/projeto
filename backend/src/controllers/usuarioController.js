const db = require("../config/database");

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
