const express = require("express");
const router = express.Router();
const comentarioController = require("../controllers/comentarioController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/:id", authMiddleware, comentarioController.criar);

router.get("/:id", comentarioController.listarPorAtividade);

module.exports = router;
