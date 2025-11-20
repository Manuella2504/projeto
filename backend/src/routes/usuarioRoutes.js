const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/cadastrar", usuarioController.cadastrar);
router.get("/", usuarioController.listar);
router.put("/atualizar", authMiddleware, usuarioController.atualizar);
router.delete("/deletar", authMiddleware, usuarioController.deletar);

module.exports = router;
