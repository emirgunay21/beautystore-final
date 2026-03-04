const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const authenticateToken = require("../middleware/authMiddleware");

// GET /products  (public)
router.get("/", ProductController.getProducts);

// GET /products/:id  (public)
router.get("/:id", ProductController.getProductById);

// POST /products  (protected)
router.post("/", authenticateToken, ProductController.createProduct);

// PUT /products/:id  (protected)
router.put("/:id", authenticateToken, ProductController.updateProduct);

// DELETE /products/:id  (protected)
router.delete("/:id", authenticateToken, ProductController.deleteProduct);

module.exports = router;