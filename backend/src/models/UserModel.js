const pool = require("../db");

async function getUserById(id) {
  const [rows] = await pool.query(
    `
    SELECT id, name, email, role, created_at
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

async function updateUserProfile(id, { name, email }) {
  await pool.query(
    `
    UPDATE users
    SET name = ?, email = ?
    WHERE id = ?
    `,
    [name, email, id]
  );

  return getUserById(id);
}

module.exports = {
  getUserById,
  updateUserProfile,
};