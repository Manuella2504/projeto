const db = require("../config/database");
const bcrypt = require("bcryptjs");

exports.cadastrar = async (req, res) => {
    const { nome_usuario, email_usuario, senha_usuario, avatar_url } = req.body;

    try {
        const [existe] = await db.query(
            "SELECT email_usuario FROM usuarios WHERE email_usuario = ?",
            [email_usuario]
        );

        if (existe.length > 0) {
            return res.status(400).json({ erro: "Email já está cadastrado" });
        }

        if (senha_usuario.length < 6) {
            return res.status(400).json({ erro: "A senha deve ter no mínimo 6 caracteres" });
        }

        const hash = await bcrypt.hash(senha_usuario, 10);

        await db.query(
            `INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario, avatar_url)
             VALUES (?, ?, ?, ?)`,
            [nome_usuario, email_usuario, hash, avatar_url || null]
        );

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ erro: "Erro no servidor" });
    }
};


exports.listar = async (req, res) => {
    try {
        const [usuarios] = await db.query(
            "SELECT id_usuario, nome_usuario, email_usuario, avatar_url, data_criacao FROM usuarios"
        );

        return res.json(usuarios);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ erro: "Erro ao listar usuários" });
    }
};


exports.atualizar = async (req, res) => {
    const id = req.id_usuario;
    const { nome_usuario, email_usuario, senha_usuario, avatar_url } = req.body;

    try {
        const [existe] = await db.query(
            "SELECT id_usuario FROM usuarios WHERE email_usuario = ? AND id_usuario != ?",
            [email_usuario, id]
        );

        if (existe.length > 0) {
            return res.status(400).json({ erro: "O email já está sendo usado por outro usuário" });
        }

        let hash = null;

        if (senha_usuario) {
            if (senha_usuario.length < 6) {
                return res.status(400).json({ erro: "A nova senha deve ter no mínimo 6 caracteres" });
            }

            hash = await bcrypt.hash(senha_usuario, 10);
        }

        await db.query(
            `
            UPDATE usuarios SET
                nome_usuario = ?,
                email_usuario = ?,
                senha_usuario = COALESCE(?, senha_usuario),
                avatar_url = ?
            WHERE id_usuario = ?
            `,
            [nome_usuario, email_usuario, hash, avatar_url || null, id]
        );

        return res.json({ mensagem: "Usuário atualizado com sucesso" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
};

exports.deletar = async (req, res) => {
    const id = req.id_usuario;

    try {
        const [resultado] = await db.query(
            "DELETE FROM usuarios WHERE id_usuario = ?",
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        return res.json({ mensagem: "Usuário deletado com sucesso" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ erro: "Erro ao excluir usuário" });
    }
};
