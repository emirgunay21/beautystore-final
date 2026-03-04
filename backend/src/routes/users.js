const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

// GET /users/me (protected)
router.get("/me", authenticateToken, async (req, res) => {
  return res.json({
    ok: true,
    message: "GET /users/me çalışıyor",
    user: req.user,
  });
});

// PUT /users/me (protected)
router.put("/me", authenticateToken, async (req, res) => {
  return res.json({
    ok: true,
    message: "PUT /users/me çalışıyor",
    user: req.user,
    body: req.body,
  });
});

module.exports = router;