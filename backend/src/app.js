const express = require("express");
const cors = require("cors");
const pool = require("./db");
const authRoutes = require("./routes/auth");
const productsRoutes = require("./routes/product"); // ✅ BU SATIR
const seedRoutes = require("./routes/seed");

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

// 🔗 AUTH ROUTES
app.use("/auth", authRoutes);

// 🔗 PRODUCTS ROUTES  ✅ EKLENDİ
app.use("/products", productsRoutes);

app.use("/seed", seedRoutes);

// 🔍 HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Backend çalışıyor" });
});

module.exports = app;
