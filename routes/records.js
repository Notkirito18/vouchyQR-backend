const express = require("express");
const router = express.Router();

const {
  getAllRecords,
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord,
  deleteManyRecords,
} = require("../controllers/Records");

router.route("/").get(getAllRecords).post(createRecord);
router.route("/:id").get(getRecord).patch(updateRecord).delete(deleteRecord);
router.route("/deleteMany").post(deleteManyRecords);

module.exports = router;
