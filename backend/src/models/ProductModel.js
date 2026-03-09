// src/models/ProductModel.js
const pool = require("../db");

async function getProducts({ category, limit, skip }) {

  let sql = `
    SELECT p.*, c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;

  const params = [];

  if (category) {
    sql += " WHERE c.slug = ?";
    params.push(category);
  }

  sql += " LIMIT ? OFFSET ?";
  params.push(limit, skip);

  const [rows] = await pool.query(sql, params);
  return rows;
}

async function getProductById(id) {

  const [rows] = await pool.query(
    `
    SELECT p.*, c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

module.exports = {
  getProducts,
  getProductById,
};