const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const UserController = require("../controllers/UserController");

// GET /users/me
router.get("/me", authenticateToken, UserController.getMe);

// PUT /users/me
router.put("/me", authenticateToken, UserController.updateProfile);

module.exports = router;