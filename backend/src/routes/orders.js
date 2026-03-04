const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

// GET /orders (protected)
router.get("/", authenticateToken, async (req, res) => {
  return res.json({
    ok: true,
    message: "GET /orders çalışıyor",
    user: req.user,
    orders: [],
  });
});

// POST /orders (protected)  { items: [...], address, shipping }
router.post("/", authenticateToken, async (req, res) => {
  return res.json({
    ok: true,
    message: "POST /orders çalışıyor",
    user: req.user,
    body: req.body,
  });
});

module.exports = router;