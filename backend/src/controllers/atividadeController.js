const db = require("../config/database");

const tratarNumero = (valor) => {
    if (!valor) return 0;
    if (typeof valor === 'number') return valor;
    return parseFloat(valor.toString().replace(/\./g, '').replace(',', '.')) || 0;
};


const formatarData = (dataISO) => {
    if (!dataISO) return "Data n/d";
    try {
        const dataObj = new Date(dataISO);
        if (isNaN(dataObj.getTime())) return "Data Inválida";
        

        return dataObj.toLocaleString('pt-BR');
    } catch (e) {
        return "Erro Data";
    }
};

exports.criar = async (req, res) => {
    try {
        const id_usuario = req.id_usuario;
        const { titulo, tipo, tipo_atividade, distancia_metros, duracao_minutos, calorias } = req.body;


        const tipoReal = tipo_atividade || tipo;

        if (!titulo || !tipoReal) {
            return res.status(400).json({ erro: "Título e tipo são obrigatórios." });
        }

        const dist = tratarNumero(distancia_metros);
        const dur = tratarNumero(duracao_minutos);
        const cal = tratarNumero(calorias);

        await db.query(
            `INSERT INTO atividades 
                (id_usuario, titulo, tipo_atividade, distancia_metros, duracao_minutos, calorias)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id_usuario, titulo, tipoReal, dist, dur, cal]
        );

        return res.status(201).json({ mensagem: "Atividade criada com sucesso." });

    } catch (error) {
        console.error("Erro ao criar:", error);
        return res.status(500).json({ erro: "Erro ao criar atividade." });
    }
};

exports.listar = async (req, res) => {
    try {
        const pagina = Number(req.query.pagina) || 1;
        const limite = 10;
        const offset = (pagina - 1) * limite;
        const tipo = req.query.tipo || "";

        let query = `
            SELECT 
                a.id_atividade,
                a.titulo,
                a.tipo_atividade AS tipo, 
                a.distancia_metros,
                a.duracao_minutos,
                a.calorias,
                a.data_criacao,
                u.nome_usuario, 
                u.avatar_url
            FROM atividades a
            JOIN usuarios u ON a.id_usuario = u.id_usuario
        `;

        const params = [];

        if (tipo) {
            query += " WHERE a.tipo_atividade = ? ";
            params.push(tipo);
        }

        query += " ORDER BY a.id_atividade DESC LIMIT ? OFFSET ?";
        params.push(limite, offset);

        const [rows] = await db.query(query, params);
        return res.json(rows);

    } catch (error) {
        console.error("Erro ao listar:", error);
        return res.status(500).json({ erro: "Erro ao listar atividades." });
    }
};

exports.exportarCSV = async (req, res) => {
    try {
        console.log("📄 Iniciando geração de CSV...");

        const tipo = req.query.tipo || "";
        
        let query = `
            SELECT 
                a.id_atividade,
                u.nome_usuario,
                a.titulo,
                a.tipo_atividade,
                a.distancia_metros,
                a.duracao_minutos,
                a.calorias,
                a.data_criacao
            FROM atividades a
            JOIN usuarios u ON a.id_usuario = u.id_usuario
        `;

        const params = [];
        if (tipo) {
            query += " WHERE a.tipo_atividade = ?";
            params.push(tipo);
        }
        query += " ORDER BY a.id_atividade DESC";

        const [dados] = await db.query(query, params);


        const header = "ID;Usuário;Título;Tipo;Distância (m);Duração (min);Calorias;Data Criada\n";

        const linhas = dados.map(a => {

            const nome = (a.nome_usuario || "Sem Nome").replace(/;/g, ""); 
            const titulo = (a.titulo || "Sem Título").replace(/;/g, "");
            const dataFormatada = formatarData(a.data_criacao);

            return [
                a.id_atividade,
                nome,
                titulo,
                a.tipo_atividade || "Outro",
                a.distancia_metros || 0,
                a.duracao_minutos || 0,
                a.calorias || 0,
                dataFormatada
            ].join(";");
        }).join("\n");

        const csvFinal = "\uFEFF" + header + linhas; 

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=relatorio_atividades.csv");
        
        console.log("✅ CSV gerado e enviado.");
        return res.send(csvFinal);

    } catch (error) {
        console.error("❌ Erro fatal exportar CSV:", error);

        if (!res.headersSent) {
            return res.status(500).json({ erro: "Erro ao gerar arquivo CSV." });
        }
    }
};