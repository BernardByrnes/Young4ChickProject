const Notification = require("../models/Notification");

exports.markRead = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification || notification.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized or notification not found" });
    }
    notification.read = true;
    await notification.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Error marking notification read:", err);
    res.status(500).json({ error: "Server error" });
  }
};
