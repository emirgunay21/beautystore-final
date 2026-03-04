const express = require("express");
const router = express.Router();

const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// GET /cart (protected) -> kullanıcının sepeti
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT ci.product_id AS productId, ci.quantity
       FROM cart_items ci
       WHERE ci.user_id = ?
       ORDER BY ci.id DESC`,
      [userId]
    );

    return res.json({ ok: true, cart: rows });
  } catch (err) {
    console.error("GET /cart error:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
});

// POST /cart (protected) { productId, qty }  -> upsert
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.body.productId);
    const qty = Math.max(Number(req.body.qty || 1), 1);

    if (!Number.isFinite(productId)) {
      return res.status(400).json({ ok: false, message: "Geçersiz productId" });
    }

    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [userId, productId, qty]
    );

    return res.json({ ok: true, message: "Sepete eklendi" });
  } catch (err) {
    console.error("POST /cart error:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
});

// PUT /cart/:productId (protected) { qty } -> quantity set
router.put("/:productId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);
    const qty = Number(req.body.qty);

    if (!Number.isFinite(productId) || !Number.isFinite(qty)) {
      return res.status(400).json({ ok: false, message: "Geçersiz değer" });
    }

    if (qty <= 0) {
      await pool.query(
        "DELETE FROM cart_items WHERE user_id=? AND product_id=?",
        [userId, productId]
      );
      return res.json({ ok: true, message: "Ürün silindi" });
    }

    await pool.query(
      "UPDATE cart_items SET quantity=? WHERE user_id=? AND product_id=?",
      [qty, userId, productId]
    );

    return res.json({ ok: true, message: "Sepet güncellendi" });
  } catch (err) {
    console.error("PUT /cart error:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
});

// DELETE /cart/:productId (protected)
router.delete("/:productId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    if (!Number.isFinite(productId)) {
      return res.status(400).json({ ok: false, message: "Geçersiz productId" });
    }

    await pool.query(
      "DELETE FROM cart_items WHERE user_id=? AND product_id=?",
      [userId, productId]
    );

    return res.json({ ok: true, message: "Sepetten silindi" });
  } catch (err) {
    console.error("DELETE /cart error:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
});

module.exports = router;