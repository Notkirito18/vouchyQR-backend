const User = require("../models/User");

module.exports = async (req, res, next) => {
  const userId = req.header("userId");
  const validId = await User.model.findOne({ _id: userId });
  if (!validId) return res.status(400).json({ msg: "user id unvalid" });
  next();
};
