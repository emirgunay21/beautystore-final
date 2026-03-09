const CommentModel = require("../models/CommentModel");

async function getComments(req, res) {
  try {
    const productId = Number(req.params.productId);

    if (!Number.isFinite(productId)) {
      return res.status(400).json({
        ok: false,
        message: "Geçersiz productId",
      });
    }

    const comments = await CommentModel.getCommentsByProduct(productId);

    return res.json({ ok: true, comments });
  } catch (err) {
    console.error("COMMENTS ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: err.message,
      code: err.code,
    });
  }
}

async function createComment(req, res) {
  try {
    const { productId, stars, text } = req.body || {};

    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!Number.isFinite(Number(productId)) || !text?.trim()) {
      return res.status(400).json({
        ok: false,
        message: "productId ve text zorunlu",
      });
    }

    const commentId = await CommentModel.addComment({
      productId: Number(productId),
      userId,
      userEmail,
      stars: Number(stars || 5),
      text: text.trim(),
    });

    return res.json({ ok: true, commentId });
  } catch (err) {
    console.error("COMMENTS ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: err.message,
      code: err.code,
    });
  }
}

module.exports = {
  getComments,
  createComment,
};