require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");
const db = require("../config/database");
const bcrypt = require("bcrypt");


const parseCSVNumber = (val) => {
    if (!val) return 0;
    return parseFloat(val.replace(',', '.')) || 0;
};


function importarUsuarios() {
    const results = [];

    fs.createReadStream(__dirname + "/usuarios.csv")
        .pipe(csv({ separator: ';' })) 
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            console.log(`Lendo ${results.length} usuários...`);
            for (const row of results) {
                try {
                    if (!row.email_usuario) continue; 
                    
                    const senhaHash = await bcrypt.hash(row.senha_usuario, 10);
                    await db.query(
                        `INSERT INTO usuarios (id_usuario, nome_usuario, email_usuario, senha_usuario, avatar_url)
                        VALUES (?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE nome_usuario = VALUES(nome_usuario)`, // Evita erro se já existe
                        [
                            row.id_usuario,
                            row.nome_usuario,
                            row.email_usuario,
                            senhaHash,
                            row.avatar_url || null
                        ]
                    );
                } catch (e) {
                    console.log(`Erro usuário ${row.nome_usuario}:`, e.message);
                }
            }
            console.log("✅ Usuários importados!");
        });
}


function importarAtividades() {
    const results = [];
    fs.createReadStream(__dirname + "/atividades.csv")
        .pipe(csv({ separator: ';' }))
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            console.log(`Lendo ${results.length} atividades...`);
            for (const row of results) {
                try {

                    const distBruta = row.distancia || row.distancia_km || "0";
                    const durBruta = row.duracao || row.duracao_horas || "0";

                    const distMetros = parseCSVNumber(distBruta); 


                    const durMinutos = parseCSVNumber(durBruta); 

                    await db.query(
                        `INSERT INTO atividades 
                        (id_usuario, titulo, tipo_atividade, distancia_metros, duracao_minutos, calorias, data_criacao)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            row.id_usuario,
                            row.titulo,
                            row.tipo || row.tipo_atividade,
                            distMetros,
                            durMinutos,
                            parseCSVNumber(row.calorias),
                            row.data || row.data_criacao
                        ]
                    );
                } catch (e) {
                    console.log(`Erro atividade user ${row.id_usuario}:`, e.message);
                }
            }
            console.log("✅ Atividades importadas!");
        });
}

importarUsuarios();
setTimeout(importarAtividades, 3000); 