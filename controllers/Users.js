const User = require("../models/User");
const asyncWrapper = require("../middleware/async");
const { userValidation, userLoginValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//* add item to database
//* in this case this is registering a user
const createUser = asyncWrapper(async (req, res) => {
  // authorization check
  if (req.headers.key !== process.env.API_KEY) {
    res.status(401).json({ msg: "access unauthorized" });
  } else {
    // validation
    const error = userValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    //checking if email already exist
    const emailExist = await User.model.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).json({ error: "email already exist" });
    }

    // password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // user creation
    const user = new User.model({ ...req.body, password: hashedPassword });

    // response
    const savedUser = await user.save();
    res.status(201).json({ user: savedUser });
  }
});

//* userlogin
const loginUser = asyncWrapper(async (req, res) => {
  // validation
  const error = userLoginValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  //checking if email already exist
  const loggedInUser = await User.model.findOne({ email: req.body.email });
  if (!loggedInUser) {
    return res.status(403).json({ error: "Email or password is wrong" });
  }
  //cheking if password is correct
  const validPass = await bcrypt.compare(
    req.body.password,
    loggedInUser.password
  );
  if (!validPass) {
    return res.status(403).json({ error: "Email or password is wrong" });
  }

  // create and assign token
  const token = jwt.sign({ _id: loggedInUser._id }, process.env.TOKEN_KEY);
  res.header("auth-token", token);

  // response
  res.status(200).json({ user: loggedInUser });
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
    return res.status(404).json({ error: "No data matches the id : " + _id });
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
    return res.status(404).json({ error: "No data matches the id : " + _id });
  }
  res.status(200).json({ user: user });
});

//* delete singel item in database operation
const deleteUser = asyncWrapper(async (req, res) => {
  // response
  const _id = req.params.id;
  const user = await User.model.deleteOne({ _id });
  if (!user) {
    return res.status(404).json({ error: "No data matches the id : " + _id });
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
