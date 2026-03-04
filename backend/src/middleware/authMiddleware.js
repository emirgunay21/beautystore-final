console.log("authMiddleware dosyası yüklendi");

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {

  console.log("authMiddleware çalıştı:", req.method, req.originalUrl);

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("TOKEN YOK -> 401 dönüyor");
    return res.status(401).json({ ok: false, message: "Token gerekli" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) {
      console.log("TOKEN HATALI");
      return res.status(403).json({ ok: false, message: "Geçersiz token" });
    }

    console.log("TOKEN DOĞRULANDI:", user);

    req.user = user;
    next();

  });
}

module.exports = authenticateToken;