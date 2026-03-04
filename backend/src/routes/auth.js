const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// test
router.get("/test", (req, res) => {
  res.json({ ok: true, message: "auth route çalışıyor" });
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: "name, email, password zorunlu",
      });
    }

    // email check
    const [existsRows] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    if (existsRows.length) {
      return res.status(409).json({ ok: false, message: "Bu email zaten kayıtlı" });
    }

    // hash password
    const password_hash = await bcrypt.hash(password, 10);

    // insert
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
      [name, email, password_hash]
    );

    return res.status(201).json({
      ok: true,
      user: {
        id: result.insertId,
        name,
        email,
        role: "user",
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "email ve password zorunlu" });
    }

    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ ok: false, message: "email veya şifre hatalı" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ ok: false, message: "email veya şifre hatalı" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.json({
      ok: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
});
// PROFILE (JWT protected)  -> GET /auth/profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1",
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ ok: false, message: "Kullanıcı bulunamadı" });
    }

    return res.json({ ok: true, user: rows[0] });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
});

module.exports = router;
