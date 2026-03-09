const pool = require("../db");

async function getCartByUser(userId) {
  const [rows] = await pool.query(
    `SELECT ci.product_id AS productId, ci.quantity
     FROM cart_items ci
     WHERE ci.user_id = ?
     ORDER BY ci.id DESC`,
    [userId]
  );

  return rows;
}

async function addToCart(userId, productId, qty) {
  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [userId, productId, qty]
  );
}

async function updateCartItem(userId, productId, qty) {
  if (qty <= 0) {
    await pool.query(
      "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );
    return "deleted";
  }

  await pool.query(
    "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
    [qty, userId, productId]
  );

  return "updated";
}

async function deleteCartItem(userId, productId) {
  await pool.query(
    "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
    [userId, productId]
  );
}

module.exports = {
  getCartByUser,
  addToCart,
  updateCartItem,
  deleteCartItem,
};