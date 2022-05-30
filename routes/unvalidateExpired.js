const express = require("express");
const router = express.Router();

const { unvalidateExpiredVouchers } = require("../controllers/Guests");

router.route("/").get(unvalidateExpiredVouchers);

module.exports = router;
