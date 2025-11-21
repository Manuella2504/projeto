require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");
const db = require("../config/database");

// IMPORTAR USUÁRIOS
function importarUsuarios() {
    fs.createReadStream(__dirname + "/usuarios.csv")
        .pipe(csv())
        .on("data", async (row) => {
            try {
                await db.query(
                    `INSERT INTO usuarios (id_usuario, nome_usuario, email_usuario, senha_usuario, avatar_url)
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        row.id_usuario,
                        row.nome_usuario,
                        row.email_usuario,
                        row.senha_usuario,
                        row.avatar_url || null
                    ]
                );
            } catch (e) {
                console.log("Erro ao inserir usuário:", e.message);
            }
        })
        .on("end", () => {
            console.log("Importação de usuários concluída!");
        });
}

// IMPORTAR ATIVIDADES
function importarAtividades() {
    fs.createReadStream(__dirname + "/atividades.csv")
        .pipe(csv())
        .on("data", async (row) => {
            try {
                await db.query(
                    `INSERT INTO atividades 
                    (id_usuario, titulo, tipo, distancia_km, duracao_horas, calorias, data_criacao)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        row.id_usuario,
                        row.titulo,
                        row.tipo,
                        row.distancia / 1000,  // metros → km
                        row.duracao / 60,     // minutos → horas
                        row.calorias,
                        row.data
                    ]
                );
            } catch (e) {
                console.log("Erro ao inserir atividade:", e.message);
            }
        })
        .on("end", () => {
            console.log("Importação de atividades concluída!");
        });
}

importarUsuarios();
importarAtividades();
