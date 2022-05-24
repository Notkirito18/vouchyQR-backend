const mongoose = require("mongoose");
const UserData = require("./submodels/UserData");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = {
  model: mongoose.model("User", UserSchema),
  schema: UserSchema,
};
