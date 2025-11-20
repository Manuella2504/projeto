const db = require("../config/database");
const dayjs = require("dayjs");

exports.criar = async (req, res) => {
    const id_usuario = req.id_usuario;
    const { distancia_metros, duracao_minutos, calorias, titulo, tipo_atividade } = req.body;

    try {
        if (!distancia_metros || !duracao_minutos || !calorias || !titulo || !tipo_atividade) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        const tiposValidos = ["corrida", "caminhada", "trilha"];
        if (!tiposValidos.includes(tipo_atividade)) {
            return res.status(400).json({ erro: "Tipo de atividade inválido." });
        }

        if (isNaN(distancia_metros) || isNaN(duracao_minutos) || isNaN(calorias)) {
            return res.status(400).json({ erro: "Distância, duração e calorias precisam ser números." });
        }

        await db.query(
            `INSERT INTO atividades (id_usuario, distancia_metros, duracao_minutos, calorias, titulo, tipo_atividade)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id_usuario, distancia_metros, duracao_minutos, calorias, titulo, tipo_atividade]
        );

        return res.status(201).json({ mensagem: "Atividade criada com sucesso!" });

    } catch (error) {
        return res.status(500).json({ erro: "Erro no servidor" });
    }
};


exports.listar = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const tipo = req.query.tipo;
        const limite = 4;
        const offset = (pagina - 1) * limite;

        const params = [];
        let filtro = "";

        const tiposValidos = ["corrida", "caminhada", "trilha"];

        if (tipo && tiposValidos.includes(tipo)) {
            filtro = "WHERE a.tipo_atividade = ?";
            params.push(tipo);
        }

        params.push(limite, offset);

        const [atividades] = await db.query(
            `
            SELECT 
                a.id_atividade,
                a.titulo,
                a.distancia_metros,
                a.duracao_minutos,
                a.calorias,
                a.tipo_atividade,
                a.data_criacao,
                u.id_usuario,
                u.nome_usuario,
                u.avatar_url
            FROM atividades a
            JOIN usuarios u ON u.id_usuario = a.id_usuario
            ${filtro}
            ORDER BY a.data_criacao DESC
            LIMIT ? OFFSET ?
            `,
            params
        );

        const ids = atividades.map(a => a.id_atividade);

        let likesMap = {};
        let comentariosMap = {};
        let likedByUser = {};

        if (ids.length > 0) {
            const [likes] = await db.query(
                `SELECT id_atividade, COUNT(*) AS total FROM likes 
                 WHERE id_atividade IN (${ids.map(() => "?").join(",")})
                 GROUP BY id_atividade`,
                ids
            );
            likes.forEach(l => likesMap[l.id_atividade] = l.total);

            const [comentarios] = await db.query(
                `SELECT id_atividade, COUNT(*) AS total FROM comentarios 
                 WHERE id_atividade IN (${ids.map(() => "?").join(",")})
                 GROUP BY id_atividade`,
                ids
            );
            comentarios.forEach(c => comentariosMap[c.id_atividade] = c.total);

            if (req.id_usuario) {
                const [userLikes] = await db.query(
                    `SELECT id_atividade FROM likes 
                     WHERE id_usuario = ? AND id_atividade IN (${ids.map(() => "?").join(",")})`,
                    [req.id_usuario, ...ids]
                );
                userLikes.forEach(l => likedByUser[l.id_atividade] = true);
            }
        }

        const listaFormatada = atividades.map(a => {
            return {
                id_atividade: a.id_atividade,
                titulo: a.titulo,
                tipo_atividade: a.tipo_atividade,
                distancia_metros: a.distancia_metros,
                duracao_minutos: a.duracao_minutos,
                calorias: a.calorias,
                usuario: {
                    id_usuario: a.id_usuario,
                    nome_usuario: a.nome_usuario,
                    avatar_url: a.avatar_url
                },
                likes: likesMap[a.id_atividade] || 0,
                comentarios: comentariosMap[a.id_atividade] || 0,
                liked_by_user: !!likedByUser[a.id_atividade],
                data_criacao: dayjs(a.data_criacao).format("HH:mm - DD/MM/YY")
            };
        });

        return res.json(listaFormatada);

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao listar atividades" });
    }
};
