const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET /addresses
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT id, title, tag, line, phone, created_at FROM addresses WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json({ ok: true, addresses: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// POST /addresses
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, tag, line, phone } = req.body || {};

    if (!title || !line || !phone) {
      return res.status(400).json({ ok: false, message: "title, line, phone zorunlu" });
    }

    const [result] = await pool.query(
      "INSERT INTO addresses (user_id, title, tag, line, phone) VALUES (?, ?, ?, ?, ?)",
      [userId, title, tag || "HOME", line, phone]
    );

    res.status(201).json({
      ok: true,
      address: { id: result.insertId, title, tag: tag || "HOME", line, phone },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// DELETE /addresses/:id
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);

    const [result] = await pool.query(
      "DELETE FROM addresses WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Address not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// PUT /addresses/:id
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const { title, tag, line, phone } = req.body || {};

    if (!title || !line || !phone) {
      return res.status(400).json({ ok: false, message: "title, line, phone zorunlu" });
    }

    const [result] = await pool.query(
      "UPDATE addresses SET title = ?, tag = ?, line = ?, phone = ? WHERE id = ? AND user_id = ?",
      [title, tag || "HOME", line, phone, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Address not found" });
    }

    res.json({ ok: true, address: { id, title, tag: tag || "HOME", line, phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;