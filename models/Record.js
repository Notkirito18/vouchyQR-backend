const mongoose = require("mongoose");
const Guest = require("./Guest");
const Voucher = require("./submodels/Voucher");

const RecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: new Date(),
  },
  type: {
    type: String,
  },
  guestId: {
    type: String,
  },
  guestName: {
    type: String,
  },
  voucherId: {
    type: String,
  },
  userDataId: {
    type: String,
    required: true,
  },
});

module.exports = {
  model: mongoose.model("Record", RecordSchema),
  schema: RecordSchema,
};
