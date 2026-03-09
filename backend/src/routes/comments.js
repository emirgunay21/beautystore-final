const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const CommentController = require("../controllers/CommentController");

// GET /comments/:productId
router.get("/:productId", CommentController.getComments);

// POST /comments
router.post("/", authenticateToken, CommentController.createComment);

module.exports = router;