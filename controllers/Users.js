const User = require("../models/User");
const asyncWrapper = require("../middleware/async");
const { userValidation, userLoginValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//* add item to database
//* in this case this is registering a user
const createUser = asyncWrapper(async (req, res) => {
  // user creation
  const user = new User.model(req.body);
  if (req.body.admin) {
    user.userDataId = user._id;
  } else {
    if (!req.body.userDataId) {
      return res
        .status(400)
        .json({ msg: "none admin users must have a userDataId" });
    }
  }
  // validation
  const error = userValidation(user);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  //checking if email already exist
  const emailExist = await User.model.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ msg: "email already exist" });
  }

  // password hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword;

  const savedUser = await user.save();

  // create and assign token
  const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_KEY, {
    expiresIn: 3600,
  });
  res.header("authToken", token);
  res.header("expires-in", 3600);
  res.header("Access-Control-Expose-Headers", ["authToken", "expires-in"]);

  // response
  res.status(201).json({
    email: savedUser.email,
    userId: savedUser._id,
    userDataId: savedUser.userDataId,
  });
});

//* userlogin
const loginUser = asyncWrapper(async (req, res) => {
  // validation
  const error = userLoginValidation(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  //checking if email already exist
  const loggedInUser = await User.model.findOne({ email: req.body.email });
  if (!loggedInUser) {
    return res.status(403).json({ msg: "-Email- or password is wrong" });
  }
  //cheking if password is correct
  const validPass = await bcrypt.compare(
    req.body.password,
    loggedInUser.password
  );
  if (!validPass) {
    return res.status(403).json({ msg: "Email or -password- is wrong" });
  }

  // create and assign token
  const token = jwt.sign({ _id: loggedInUser._id }, process.env.TOKEN_KEY, {
    expiresIn: 3600,
  });
  res.header("authToken", token);
  res.header("expires-in", 3600);
  res.header("Access-Control-Expose-Headers", ["authToken", "expires-in"]);

  // response
  res.status(200).json({
    email: loggedInUser.email,
    _id: loggedInUser._id,
    admin: loggedInUser.admin,
    userDataId: loggedInUser.userDataId,
    username: loggedInUser.username,
  });
});

//* getting all the data operation

const getAllUsers = asyncWrapper(async (req, res) => {
  // response
  const users = await User.model.find(req.query);
  res.status(200).json({
    users: users,
  });
});

//* getting singel item in database operation
const getUser = asyncWrapper(async (req, res) => {
  // response
  const _id = req.params.id;
  const user = await User.model.findOne({ _id });
  if (!user) {
    return res.status(404).json({ msg: "No data matches the id : " + _id });
  }
  res.status(200).json({ user: user });
});

//* updating singel item in database operation
const updateUser = asyncWrapper(async (req, res) => {
  // response
  const _id = req.params.id;
  const newUser = req.body;
  const user = await User.model.findOneAndUpdate({ _id }, newUser, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return res.status(404).json({ msg: "No data matches the id : " + _id });
  }
  res.status(200).json({ user: user });
});

//* delete singel item in database operation
const deleteUser = asyncWrapper(async (req, res) => {
  // response
  const _id = req.params.id;
  const user = await User.model.deleteOne({ _id });
  if (!user) {
    return res.status(404).json({ msg: "No data matches the id : " + _id });
  }
  res
    .status(200)
    .json({ _id: _id, msg: "user with id " + _id + " was deleted" });
});

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
};
