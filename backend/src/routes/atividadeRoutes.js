const express = require("express");
const router = express.Router();
const atividadeController = require("../controllers/atividadeController");
const { authMiddleware, authOptional } = require("../middlewares/authMiddleware");

router.post("/criar", authMiddleware, atividadeController.criar);
router.get("/", authOptional, atividadeController.listar);
router.get("/exportar", atividadeController.exportarCSV);

module.exports = router;