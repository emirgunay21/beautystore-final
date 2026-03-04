const ProductModel = require("../models/ProductModel");

// GET /products
async function getProducts(req, res) {
  try {
    const category = (req.query.category || "").trim();
    const limit = Math.min(parseInt(req.query.limit || "100", 10), 200);
    const skip = Math.max(parseInt(req.query.skip || "0", 10), 0);

    const products = await ProductModel.getProducts({
      category,
      limit,
      skip,
    });

    return res.json({
      ok: true,
      source: "database",
      products,
      limit,
      skip,
      total: products.length,
    });
  } catch (err) {
    console.error("PRODUCTS ERROR:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
}

// GET /products/:id
async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      return res.status(400).json({ ok: false, message: "Geçersiz id" });
    }

    const product = await ProductModel.getProductById(id);

    if (!product) {
      return res.status(404).json({ ok: false, message: "Ürün bulunamadı" });
    }

    return res.json({
      ok: true,
      source: "database",
      product,
    });
  } catch (err) {
    console.error("PRODUCT BY ID ERROR:", err);
    return res.status(500).json({ ok: false, message: "Sunucu hatası" });
  }
}

// POST /products (protected)
async function createProduct(req, res) {
  try {
    return res.json({
      ok: true,
      message: "createProduct endpoint çalışıyor",
      body: req.body,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

// PUT /products/:id (protected)
async function updateProduct(req, res) {
  try {
    return res.json({
      ok: true,
      message: "updateProduct endpoint çalışıyor",
      id: req.params.id,
      body: req.body,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

// DELETE /products/:id (protected)
async function deleteProduct(req, res) {
  try {
    return res.json({
      ok: true,
      message: "deleteProduct endpoint çalışıyor",
      id: req.params.id,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};