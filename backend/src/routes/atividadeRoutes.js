const express = require("express");
const router = express.Router();
const atividadeController = require("../controllers/atividadeController");
const auth = require("../middleware/auth");

router.post("/criar", auth, atividadeController.criar);

router.get("/", atividadeController.listar);

module.exports = router;
