const OrderModel = require("../models/OrderModel");

async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { addressId } = req.body || {};

    const order = await OrderModel.createOrderFromCart(userId, addressId);

    return res.status(201).json({
      ok: true,
      order,
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);

    if (err.message === "Cart is empty") {
      return res.status(400).json({ ok: false, message: "Sepet boş" });
    }

    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
}

async function getOrders(req, res) {
  try {
    const userId = req.user.id;
    const orders = await OrderModel.getOrdersByUser(userId);

    return res.json({ ok: true, orders });
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
}

async function getOrderDetail(req, res) {
  try {
    const userId = req.user.id;
    const orderId = Number(req.params.id);

    const order = await OrderModel.getOrderById(userId, orderId);

    if (!order) {
      return res.status(404).json({ ok: false, message: "Sipariş bulunamadı" });
    }

    return res.json({ ok: true, order });
  } catch (err) {
    console.error("GET ORDER DETAIL ERROR:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderDetail,
};