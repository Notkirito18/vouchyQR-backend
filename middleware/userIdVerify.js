const User = require("../models/User");

module.exports = async (req, res, next) => {
  const userDataId = req.header("userDataId");
  const validId = await User.model.findOne({ _id: userDataId });
  if (!validId) return res.status(400).json({ msg: "user data id unvalid" });
  next();
};
