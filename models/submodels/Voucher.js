const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema({
  holderId: {
    type: String,
  },
  validUntill: {
    type: Date,
  },
  createdDate: {
    type: Date,
    default: new Date(),
  },
  unvalid: { type: Boolean, default: false },
});

module.exports = {
  model: mongoose.model("Voucher", VoucherSchema),
  schema: VoucherSchema,
};
