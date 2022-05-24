const mongoose = require("mongoose");
const Guest = require("../Guest");
const Record = require("../Record");

const UserDataSchema = new mongoose.Schema({
  guests: {
    type: [Guest.schema],
  },
  records: {
    type: [Record.schema],
  },
});

module.exports = {
  model: mongoose.model("userData", UserDataSchema),
  schema: UserDataSchema,
};
