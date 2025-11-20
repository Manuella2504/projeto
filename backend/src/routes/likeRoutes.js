const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/:id", authMiddleware, likeController.toggle);

module.exports = router;
