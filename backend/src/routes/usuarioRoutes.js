const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/cadastrar", usuarioController.cadastrar);
router.get("/", usuarioController.listar);

// 📌 Rota de Exportar CSV (Deve vir ANTES de /:id)
router.get("/exportar", usuarioController.exportarCSV);

router.get("/perfil", authMiddleware, usuarioController.perfil);
router.get("/:id", usuarioController.buscarPorId);
router.put("/:id", authMiddleware, usuarioController.atualizar);
router.delete("/:id", authMiddleware, usuarioController.deletar);

module.exports = router;