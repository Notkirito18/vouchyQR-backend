const express = require("express");
const router = express.Router();

const {
  getAllRecords,
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord,
} = require("../controllers/Records");

router.route("/").get(getAllRecords).post(createRecord);
router.route("/:id").get(getRecord).patch(updateRecord).delete(deleteRecord);

module.exports = router;
