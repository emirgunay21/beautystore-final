const express = require("express");
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET comments by product
router.get("/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    const [rows] = await pool.query(
      "SELECT * FROM comments WHERE productId = ? ORDER BY createdAt DESC",
      [productId]
    );

    res.json({ ok: true, comments: rows });
 } catch (err) {
  console.error("COMMENTS ERROR:", err);
  res.status(500).json({ ok: false, message: err.message, code: err.code });
}
});

// ADD comment
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productId, stars, text } = req.body;

    const userId = req.user.id;
    const userEmail = req.user.email;

    const [result] = await pool.query(
      `INSERT INTO comments (productId,userId,userEmail,stars,text)
       VALUES (?,?,?,?,?)`,
      [productId, userId, userEmail, stars || 5, text]
    );

    res.json({ ok: true, commentId: result.insertId });
  } catch (err) {
  console.error("COMMENTS ERROR:", err);
  res.status(500).json({ ok: false, message: err.message, code: err.code });
}
});

module.exports = router;