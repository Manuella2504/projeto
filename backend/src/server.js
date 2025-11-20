const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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

app.get("/", (req, res) => {
    res.send("API SAEPSaúde funcionando!");
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
