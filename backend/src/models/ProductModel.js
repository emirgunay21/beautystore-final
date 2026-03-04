// src/models/ProductModel.js
const pool = require("../db");

async function getProducts({ category, limit, skip }) {
  let sql = "SELECT * FROM products";
  const params = [];

  if (category) {
    // Şimdilik eski kolonla çalışıyor (category VARCHAR)
    sql += " WHERE category = ?";
    params.push(category);
  }

  sql += " LIMIT ? OFFSET ?";
  params.push(limit, skip);

  const [rows] = await pool.query(sql, params);
  return rows;
}

async function getProductById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM products WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  getProducts,
  getProductById,
};