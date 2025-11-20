const db = require("../config/database");

exports.criar = async (req, res) => {
    const id_usuario = req.id_usuario; // vem do token
    const { distancia_metros, duracao_minutos, calorias, titulo, tipo_atividade } = req.body;

    try {

        // 1) Validar campos obrigatórios
        if (!distancia_metros || !duracao_minutos || !calorias || !titulo || !tipo_atividade) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        // 2) Validar tipo_atividade
        const tiposValidos = ["corrida", "caminhada", "trilha"];
        if (!tiposValidos.includes(tipo_atividade)) {
            return res.status(400).json({ erro: "Tipo de atividade inválido." });
        }

        // 3) Validar números
        if (isNaN(distancia_metros) || isNaN(duracao_minutos) || isNaN(calorias)) {
            return res.status(400).json({ erro: "Distância, duração e calorias precisam ser números." });
        }

        // 4) Inserir no banco
        await db.query(
            `INSERT INTO atividades (id_usuario, distancia_metros, duracao_minutos, calorias, titulo, tipo_atividade)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id_usuario, distancia_metros, duracao_minutos, calorias, titulo, tipo_atividade]
        );

        return res.status(201).json({ mensagem: "Atividade criada com sucesso!" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ erro: "Erro no servidor" });
    }
};


exports.listar = async (req, res) => {
    let { pagina = 1, tipo } = req.query;

    const limite = 4;
    const offset = (pagina - 1) * limite;

    try {
        // Montar filtro
        let filtro = "";
        const params = [];

        const tiposValidos = ["corrida", "caminhada", "trilha"];

        if (tipo && tiposValidos.includes(tipo)) {
            filtro = "WHERE a.tipo_atividade = ?";
            params.push(tipo);
        }

        params.push(limite, offset);

        // Consultar no banco
        const [atividades] = await db.query(
            `
            SELECT 
                a.*,
                u.nome_usuario,
                u.avatar_url
            FROM atividades a
            JOIN usuarios u ON u.id_usuario = a.id_usuario
            ${filtro}
            ORDER BY a.id_atividade DESC
            LIMIT ? OFFSET ?
            `,
            params
        );

        // Formatando dados
        const listaFormatada = atividades.map(a => {
            return {
                id_atividade: a.id_atividade,
                titulo: a.titulo,
                tipo: a.tipo_atividade,
                distancia_km: (a.distancia_metros / 1000).toFixed(2),
                duracao_horas: (a.duracao_minutos / 60).toFixed(2),
                calorias: a.calorias,
                nome_usuario: a.nome_usuario,
                avatar_url: a.avatar_url,
                data_criacao: new Date(a.data_criacao).toLocaleString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit"
                })
            };
        });

        return res.json(listaFormatada);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ erro: "Erro ao listar atividades" });
    }
};
