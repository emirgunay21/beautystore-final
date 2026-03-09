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

    // 1) category önce categories tablosunda var mı kontrol et
    let [catRows] = await pool.query(
      "SELECT id, slug, name FROM categories WHERE slug = ? LIMIT 1",
      [category]
    );

    let categoryId;

    if (catRows.length) {
      categoryId = catRows[0].id;
    } else {
      const categoryName = String(category)
        .split("-")
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join(" ");

      const [insertCat] = await pool.query(
        "INSERT INTO categories (name, slug) VALUES (?, ?)",
        [categoryName, category]
      );

      categoryId = insertCat.insertId;
    }

    // 2) dummyjson'dan ürünleri çek
    const url = `https://dummyjson.com/products/category/${encodeURIComponent(
      category
    )}?limit=30`;

    const { data } = await axios.get(url);
    const items = data.products || [];

    // 3) products tablosuna category_id ile yaz
    for (const p of items) {
      await pool.query(
        `INSERT INTO products
          (id, title, description, category_id, price, rating, stock, brand, thumbnail)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           description = VALUES(description),
           category_id = VALUES(category_id),
           price = VALUES(price),
           rating = VALUES(rating),
           stock = VALUES(stock),
           brand = VALUES(brand),
           thumbnail = VALUES(thumbnail)`,
        [
          p.id,
          p.title,
          p.description,
          categoryId,
          p.price,
          p.rating,
          p.stock,
          p.brand,
          p.thumbnail,
        ]
      );
    }

    return res.json({
      ok: true,
      inserted: items.length,
      category,
      categoryId,
    });
  } catch (err) {
    console.error("SEED ERROR:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;