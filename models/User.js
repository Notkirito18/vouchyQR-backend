const { string } = require("joi");
const mongoose = require("mongoose");

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
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  userDataId: {
    type: String,
  },
});

module.exports = {
  model: mongoose.model("User", UserSchema),
  schema: UserSchema,
};
