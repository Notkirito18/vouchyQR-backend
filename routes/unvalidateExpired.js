const express = require("express");
const router = express.Router();

const { unvalidateExpiredVouchers } = require("../controllers/Guests");

router.route("/").patch(unvalidateExpiredVouchers);

module.exports = router;
