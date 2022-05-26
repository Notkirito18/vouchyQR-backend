const mongoose = require("mongoose");
const voucher = require("./submodels/Voucher");

const GuestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: Number,
  },
  type: {
    type: String,
    required: true,
  },
  validUntill: {
    type: Date,
    required: true,
  },
  vouchersLis: {
    type: [voucher.schema],
    required: true,
  },
  userDataId: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: new Date(),
  },
});

module.exports = {
  model: mongoose.model("Guest", GuestSchema),
  schema: GuestSchema,
};
