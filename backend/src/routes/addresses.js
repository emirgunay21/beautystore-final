const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const AddressController = require("../controllers/AddressController");

// GET /addresses
router.get("/", authenticateToken, AddressController.getAddresses);

// POST /addresses
router.post("/", authenticateToken, AddressController.createAddress);

// DELETE /addresses/:id
router.delete("/:id", authenticateToken, AddressController.deleteAddress);

// PUT /addresses/:id
router.put("/:id", authenticateToken, AddressController.updateAddress);

module.exports = router;