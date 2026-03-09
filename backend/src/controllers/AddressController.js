const AddressModel = require("../models/AddressModel");

async function getAddresses(req, res) {
  try {
    const userId = req.user.id;
    const addresses = await AddressModel.getAddressesByUser(userId);

    return res.json({ ok: true, addresses });
  } catch (err) {
    console.error("GET ADDRESSES ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}

async function createAddress(req, res) {
  try {
    const userId = req.user.id;
    const { title, tag, line, phone } = req.body || {};

    if (!title || !line || !phone) {
      return res.status(400).json({
        ok: false,
        message: "title, line, phone zorunlu",
      });
    }

    const address = await AddressModel.createAddress(userId, {
      title,
      tag,
      line,
      phone,
    });

    return res.status(201).json({ ok: true, address });
  } catch (err) {
    console.error("CREATE ADDRESS ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}

async function deleteAddress(req, res) {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      return res.status(400).json({ ok: false, message: "Geçersiz id" });
    }

    const affectedRows = await AddressModel.deleteAddress(userId, id);

    if (affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Address not found" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("DELETE ADDRESS ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}

async function updateAddress(req, res) {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const { title, tag, line, phone } = req.body || {};

    if (!Number.isFinite(id)) {
      return res.status(400).json({ ok: false, message: "Geçersiz id" });
    }

    if (!title || !line || !phone) {
      return res.status(400).json({
        ok: false,
        message: "title, line, phone zorunlu",
      });
    }

    const affectedRows = await AddressModel.updateAddress(userId, id, {
      title,
      tag,
      line,
      phone,
    });

    if (affectedRows === 0) {
      return res.status(404).json({ ok: false, message: "Address not found" });
    }

    return res.json({
      ok: true,
      address: { id, title, tag: tag || "HOME", line, phone },
    });
  } catch (err) {
    console.error("UPDATE ADDRESS ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}

module.exports = {
  getAddresses,
  createAddress,
  deleteAddress,
  updateAddress,
};