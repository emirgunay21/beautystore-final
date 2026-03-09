const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const CartController = require("../controllers/CartController");

// GET /cart
router.get("/", authenticateToken, CartController.getCart);

// POST /cart
router.post("/", authenticateToken, CartController.addCartItem);

// PUT /cart/:productId
router.put("/:productId", authenticateToken, CartController.updateCartItem);

// DELETE /cart/:productId
router.delete("/:productId", authenticateToken, CartController.deleteCartItem);

module.exports = router;