const express = require("express");
const cors = require("cors");
const pool = require("./db");

const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/product");
const seedRoutes = require("./routes/seed");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const commentsRoutes = require("./routes/comments");
const addressesRouter = require("./routes/addresses");
// DB bağlantı testi
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("DB bağlantısı OK");
  } catch (err) {
    console.error("DB bağlantı HATASI:", err.message);
  }
})();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Her gelen isteği logla (test için)
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// ROUTES
app.use("/health", (req, res) => res.json({ ok: true, message: "Backend çalışıyor" }));
app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);
app.use("/seed", seedRoutes);
app.use("/comments", commentsRoutes);
app.use("/addresses", addressesRouter);
module.exports = app;