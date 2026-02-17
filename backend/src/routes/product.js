const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /products?category=beauty&limit=12&skip=0
router.get("/", async (req, res) => {
  try {

    // 🔎 TEST LOG
    console.log(
      "✅ /products route HIT ->",
      "category:", req.query.category,
      "limit:", req.query.limit,
      "skip:", req.query.skip
    );

    const category = (req.query.category || "").trim();
    const limit = Math.min(parseInt(req.query.limit || "100", 10), 200);
    const skip = Math.max(parseInt(req.query.skip || "0", 10), 0);

    let sql = "SELECT * FROM products";
    const params = [];

    if (category) {
      sql += " WHERE category = ?";
      params.push(category);
    }

    sql += " LIMIT ? OFFSET ?";
    params.push(limit, skip);

    const [rows] = await pool.query(sql, params);

    return res.json({
      ok: true,
      source: "database",
      products: rows,
      limit,
      skip,
      total: rows.length
    });

  } catch (err) {
    console.error("PRODUCTS ERROR:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
});
// GET /products/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ ok: false, message: "Geçersiz id" });
    }

    const [rows] = await pool.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
    if (!rows.length) {
      return res.status(404).json({ ok: false, message: "Ürün bulunamadı" });
    }

    return res.json({
      ok: true,
      source: "database",
      product: rows[0],
    });
  } catch (err) {
    console.error("PRODUCT BY ID ERROR:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
});

module.exports = router;
