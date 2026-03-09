const pool = require("../db");

async function createOrderFromCart(userId, addressId) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [cartRows] = await conn.query(
      `
      SELECT 
        ci.product_id,
        ci.quantity,
        p.price
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ?
      `,
      [userId]
    );

    if (!cartRows.length) {
      throw new Error("Cart is empty");
    }

    let subtotal = 0;
    for (const item of cartRows) {
      subtotal += Number(item.price) * Number(item.quantity);
    }

    const tax = subtotal * 0.02;
    const shipping = subtotal > 0 ? 29 : 0;
    const total = subtotal + tax + shipping;

    const [orderResult] = await conn.query(
      `
      INSERT INTO orders (user_id, address_id, status, subtotal, shipping, tax, total)
      VALUES (?, ?, 'pending', ?, ?, ?, ?)
      `,
      [userId, addressId || null, subtotal, shipping, tax, total]
    );

    const orderId = orderResult.insertId;

    for (const item of cartRows) {
      await conn.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, variant)
        VALUES (?, ?, ?, ?, ?)
        `,
        [orderId, item.product_id, item.quantity, item.price, null]
      );
    }

    await conn.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);

    await conn.commit();

    return {
      id: orderId,
      subtotal,
      shipping,
      tax,
      total,
      status: "pending",
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function getOrdersByUser(userId) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows;
}

async function getOrderById(userId, orderId) {
  const [orderRows] = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE id = ? AND user_id = ?
    LIMIT 1
    `,
    [orderId, userId]
  );

  if (!orderRows.length) return null;

  const order = orderRows[0];

  const [itemRows] = await pool.query(
    `
    SELECT 
      oi.*,
      p.title,
      p.thumbnail
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
    `,
    [orderId]
  );

  return {
    ...order,
    items: itemRows,
  };
}

module.exports = {
  createOrderFromCart,
  getOrdersByUser,
  getOrderById,
};