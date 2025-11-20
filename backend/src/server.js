const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ROTAS DO BACKEND
const authRoutes = require("./routes/authRoutes");
const atividadeRoutes = require("./routes/atividadeRoutes");
const likeRoutes = require("./routes/likeRoutes");
const comentarioRoutes = require("./routes/comentarioRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

app.use("/auth", authRoutes);
app.use("/atividades", atividadeRoutes);
app.use("/likes", likeRoutes);
app.use("/comentarios", comentarioRoutes);
app.use("/usuarios", usuarioRoutes);

// SERVIR FRONTEND
app.use(express.static(path.join(__dirname, "../../frontend")));

// ROTA PRINCIPAL → envia o index.html do frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
