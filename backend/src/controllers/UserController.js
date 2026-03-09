const UserModel = require("../models/UserModel");

async function getMe(req, res) {
  try {
    const user = await UserModel.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Kullanıcı bulunamadı",
      });
    }

    return res.json({
      ok: true,
      user,
    });
  } catch (err) {
    console.error("GET ME ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Sunucu hatası",
    });
  }
}

async function updateProfile(req, res) {
  try {
    const { name, email } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        ok: false,
        message: "name ve email zorunlu",
      });
    }

    const user = await UserModel.updateUserProfile(req.user.id, {
      name,
      email,
    });

    return res.json({
      ok: true,
      user,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);

    return res.status(500).json({
      ok: false,
      message: "Sunucu hatası",
    });
  }
}

module.exports = {
  getMe,
  updateProfile,
};