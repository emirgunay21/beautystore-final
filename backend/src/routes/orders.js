const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const OrderController = require("../controllers/OrderController");

router.post("/", authenticateToken, OrderController.createOrder);
router.get("/", authenticateToken, OrderController.getOrders);
router.get("/:id", authenticateToken, OrderController.getOrderDetail);

module.exports = router;