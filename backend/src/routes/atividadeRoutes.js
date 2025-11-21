const express = require("express");
const router = express.Router();
const atividadeController = require("../controllers/atividadeController");
const { authMiddleware, authOptional } = require("../middlewares/authMiddleware");

// Criar atividade
router.post("/criar", authMiddleware, atividadeController.criar);

// Listar atividades
router.get("/", authOptional, atividadeController.listar);

// Exportar CSV - CORRIGIDO: removido /atividades do início
router.get("/exportar", atividadeController.exportarCSV);

module.exports = router;