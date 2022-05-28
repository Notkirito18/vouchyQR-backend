const User = require("../models/User");

module.exports = async (req, res, next) => {
  const userDataId = req.header("userDataId");
  if (!userDataId) return res.status(401).json({ msg: "user data id unvalid" });
  try {
    const validId = await User.model.findOne({ _id: userDataId });
    next();
  } catch (err) {
    return res.status(400).json({ msg: "user data id unvalid" });
  }
};
