const pool = require("../db");

async function getAddressesByUser(userId) {
  const [rows] = await pool.query(
    `
    SELECT id, title, tag, line, phone, created_at
    FROM addresses
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows;
}

async function createAddress(userId, { title, tag, line, phone }) {
  const [result] = await pool.query(
    `
    INSERT INTO addresses (user_id, title, tag, line, phone)
    VALUES (?, ?, ?, ?, ?)
    `,
    [userId, title, tag || "HOME", line, phone]
  );

  return {
    id: result.insertId,
    title,
    tag: tag || "HOME",
    line,
    phone,
  };
}

async function deleteAddress(userId, id) {
  const [result] = await pool.query(
    `
    DELETE FROM addresses
    WHERE id = ? AND user_id = ?
    `,
    [id, userId]
  );

  return result.affectedRows;
}

async function updateAddress(userId, id, { title, tag, line, phone }) {
  const [result] = await pool.query(
    `
    UPDATE addresses
    SET title = ?, tag = ?, line = ?, phone = ?
    WHERE id = ? AND user_id = ?
    `,
    [title, tag || "HOME", line, phone, id, userId]
  );

  return result.affectedRows;
}

module.exports = {
  getAddressesByUser,
  createAddress,
  deleteAddress,
  updateAddress,
};