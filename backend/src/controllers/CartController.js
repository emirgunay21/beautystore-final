const CartModel = require("../models/CartModel");

async function getCart(req, res) {
  try {
    const userId = req.user.id;
    const cart = await CartModel.getCartByUser(userId);

    return res.json({ ok: true, cart });
  } catch (err) {
    console.error("GET /cart error:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
}

async function addCartItem(req, res) {
  try {
    const userId = req.user.id;
    const productId = Number(req.body.productId);
    const qty = Math.max(Number(req.body.qty || 1), 1);

    if (!Number.isFinite(productId)) {
      return res.status(400).json({ ok: false, message: "Geçersiz productId" });
    }

    await CartModel.addToCart(userId, productId, qty);

    return res.json({ ok: true, message: "Sepete eklendi" });
  } catch (err) {
    console.error("POST /cart error:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
}

async function updateCartItem(req, res) {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);
    const qty = Number(req.body.qty);

    if (!Number.isFinite(productId) || !Number.isFinite(qty)) {
      return res.status(400).json({ ok: false, message: "Geçersiz değer" });
    }

    const result = await CartModel.updateCartItem(userId, productId, qty);

    if (result === "deleted") {
      return res.json({ ok: true, message: "Ürün silindi" });
    }

    return res.json({ ok: true, message: "Sepet güncellendi" });
  } catch (err) {
    console.error("PUT /cart error:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
}

async function deleteCartItem(req, res) {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    if (!Number.isFinite(productId)) {
      return res.status(400).json({ ok: false, message: "Geçersiz productId" });
    }

    await CartModel.deleteCartItem(userId, productId);

    return res.json({ ok: true, message: "Sepetten silindi" });
  } catch (err) {
    console.error("DELETE /cart error:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
}

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
};