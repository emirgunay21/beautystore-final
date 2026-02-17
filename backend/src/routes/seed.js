const express = require("express");
const axios = require("axios");
const pool = require("../db");

const router = express.Router();

// GET /seed/products?category=beauty
router.get("/products", async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ ok: false, message: "category zorunlu" });
    }

    // 1) dummyjson'dan çek
    const url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=30`;

    const { data } = await axios.get(url);
    const items = data.products || [];

    // 2) DB'ye yaz (aynı id varsa güncelle)
    for (const p of items) {
      await pool.query(
        `INSERT INTO products (id, title, description, category, price, rating, stock, brand, thumbnail)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title=VALUES(title),
           description=VALUES(description),
           category=VALUES(category),
           price=VALUES(price),
           rating=VALUES(rating),
           stock=VALUES(stock),
           brand=VALUES(brand),
           thumbnail=VALUES(thumbnail)`,
        [
          p.id,
          p.title,
          p.description,
          p.category,
          p.price,
          p.rating,
          p.stock,
          p.brand,
          p.thumbnail,
        ]
      );
    }

    return res.json({ ok: true, inserted: items.length, category });
  } catch (err) {
    console.error("SEED ERROR:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
});

module.exports = router;
