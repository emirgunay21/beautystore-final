require("dotenv").config();
console.log("ENV CHECK:", {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD_EXISTS: !!process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
});

console.log("JWT_SECRET:", process.env.JWT_SECRET); // ✅ ekle

const app = require("./app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
