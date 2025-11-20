const express = require("express");
const cors = require("cors");
const atividadeRoutes = require("./routes/atividadeRoutes");
const likeRoutes = require("./routes/likeRoutes");
const comentarioRoutes = require("./routes/comentarioRoutes");

app.use("/atividades", atividadeRoutes);
app.use("/likes", likeRoutes);
app.use("/comentarios", comentarioRoutes);

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("API SAEPSaúde funcionando!");
});

const usuarioRoutes = require("./routes/usuarioRoutes");
app.use("/usuarios", usuarioRoutes);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
