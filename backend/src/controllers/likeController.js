const db = require("../config/database");

exports.toggle = async (req, res) => {
    const id_usuario = req.id_usuario;
    const id_atividade = req.params.id;

    try {
        const [atividade] = await db.query(
            "SELECT id_atividade FROM atividades WHERE id_atividade = ?",
            [id_atividade]
        );

        if (atividade.length === 0) {
            return res.status(404).json({ erro: "Atividade não encontrada." });
        }

        const [existe] = await db.query(
            "SELECT id_like FROM likes WHERE id_usuario = ? AND id_atividade = ?",
            [id_usuario, id_atividade]
        );

        if (existe.length > 0) {
            await db.query(
                "DELETE FROM likes WHERE id_like = ?",
                [existe[0].id_like]
            );
        } else {
            await db.query(
                "INSERT INTO likes (id_usuario, id_atividade, data_criacao) VALUES (?, ?, NOW())",
                [id_usuario, id_atividade]
            );
        }

        const [total] = await db.query(
            "SELECT COUNT(*) AS likes FROM likes WHERE id_atividade = ?",
            [id_atividade]
        );

        return res.json({
            id_atividade: Number(id_atividade),
            likes: total[0].likes,
            liked_by_user: existe.length === 0
        });

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao processar like." });
    }
};
