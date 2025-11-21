const db = require("../config/database");

// =========================================================
// 📌 CRIAR ATIVIDADE
// =========================================================
exports.criar = async (req, res) => {
    try {
        const id_usuario = req.id_usuario;
        const { titulo, tipo, distancia_km, duracao_horas, calorias } = req.body;

        if (!titulo || !tipo) {
            return res.status(400).json({ erro: "Título e tipo são obrigatórios." });
        }

        await db.query(
            `INSERT INTO atividades 
                (id_usuario, titulo, tipo, distancia_km, duracao_horas, calorias)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id_usuario, titulo, tipo, distancia_km, duracao_horas, calorias]
        );

        return res.status(201).json({ mensagem: "Atividade criada com sucesso." });

    } catch (error) {
        console.error("Erro ao criar:", error);
        return res.status(500).json({ erro: "Erro ao criar atividade." });
    }
};

// =========================================================
// 📌 LISTAR ATIVIDADES (com tipo + paginação)
// =========================================================
exports.listar = async (req, res) => {
    try {
        const pagina = Number(req.query.pagina) || 1;
        const limite = 10;
        const offset = (pagina - 1) * limite;
        const tipo = req.query.tipo || "";

        let query = `
            SELECT a.*, u.nome_usuario, u.avatar_url
            FROM atividades a
            JOIN usuarios u ON a.id_usuario = u.id_usuario
        `;

        const params = [];

        if (tipo) {
            query += " WHERE a.tipo = ? ";
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

// =========================================================
// 📌 EXPORTAR CSV - MELHORADO
// =========================================================
exports.exportarCSV = async (req, res) => {
    try {
        console.log("📄 Iniciando exportação de CSV...");

        // Busca opcionalmente por tipo
        const tipo = req.query.tipo || "";
        
        let query = `
            SELECT 
                a.id_atividade,
                u.nome_usuario,
                a.titulo,
                a.tipo,
                a.distancia_km,
                a.duracao_horas,
                a.calorias,
                DATE_FORMAT(a.data_criacao, '%d/%m/%Y %H:%i:%s') as data_criacao
            FROM atividades a
            JOIN usuarios u ON a.id_usuario = u.id_usuario
        `;

        const params = [];

        if (tipo) {
            query += " WHERE a.tipo = ?";
            params.push(tipo);
        }

        query += " ORDER BY a.id_atividade DESC";

        const [dados] = await db.query(query, params);

        console.log(`✅ Encontrados ${dados.length} registros para exportar`);

        if (dados.length === 0) {
            return res.status(400).json({ erro: "Nenhuma atividade encontrada para exportar." });
        }

        // Cabeçalho do CSV
        const header = [
            "ID",
            "Usuário",
            "Título",
            "Tipo",
            "Distância (km)",
            "Duração (h)",
            "Calorias",
            "Data"
        ].join(";") + "\n";

        // Linhas do CSV
        const linhas = dados
            .map(a =>
                [
                    a.id_atividade,
                    `"${a.nome_usuario}"`, // Aspas para evitar problemas com vírgulas/ponto-e-vírgula
                    `"${a.titulo}"`,
                    a.tipo,
                    a.distancia_km || 0,
                    a.duracao_horas || 0,
                    a.calorias || 0,
                    a.data_criacao
                ].join(";")
            )
            .join("\n");

        const csv = header + linhas;

        // Configurar headers HTTP para download
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=atividades.csv");

        console.log("✅ CSV gerado com sucesso!");

        return res.send("\uFEFF" + csv); // BOM UTF-8 para Excel reconhecer acentos

    } catch (error) {
        console.error("❌ Erro ao exportar CSV:", error);
        return res.status(500).json({ erro: "Erro ao exportar CSV." });
    }
};