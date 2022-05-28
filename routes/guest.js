const express = require("express");
const router = express.Router();

const { getGuest } = require("../controllers/Guests");

router.route("/:id").get(getGuest);

module.exports = router;
