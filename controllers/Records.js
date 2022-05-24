const Record = require("../models/Record");

const asyncWrapper = require("../middleware/async");
const { recordValidation } = require("../validation");

//* getting all the data operation

const getAllRecords = asyncWrapper(async (req, res) => {
  // getting userId
  const userId = req.header("userId");

  //response with only the records that have the userId
  const records = await Record.model.find(req.query);
  res.status(200).json({
    records: records.filter((item) => {
      return (item.userId = userId);
    }),
  });
});

//* add item to database
const createRecord = asyncWrapper(async (req, res) => {
  // getting userId
  const userId = req.header("userId");

  // updating record object with userId
  const record = new Record.model(req.body);
  record.userId = userId;

  //validation
  const error = recordValidation(record);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  //creating the record and responding
  const recordCreated = await Record.model.create(record);
  res.status(201).json({ recordCreated });
});

//* getting singel item in database operation
const getRecord = asyncWrapper(async (req, res) => {
  // getting userId
  const userId = req.header("userId");

  //getting record
  const _id = req.params.id;
  const record = await Record.model.findOne({ _id });
  // record with _id doesn't exist or it exist but belongs to different user
  if (!record || record.userId != userId)
    return res.status(400).json({ error: "No data matches the id : " + _id });

  // response
  res.status(200).json({ record: record });
});

//* updating singel item in database operation
const updateRecord = asyncWrapper(async (req, res) => {
  // getting userId
  const userId = req.header("userId");

  //validating newRecord data
  const newRecord = req.body;
  const error = recordValidation(newRecord);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  //getting record to update
  const _id = req.params.id;
  const record = await Record.modGuestel.findOne({ _id });
  // record with _id doesn't exist or it exist but belongs to different user
  if (!record || record.userId != userId)
    return res.status(400).json({ error: "No data matches the id : " + _id });

  // updating the record and responding
  const recordUpdated = await Record.model.findOneAndUpdate(
    { _id },
    newRecord,
    {
      new: true,
      runValidators: true,
    }
  );
  if (recordUpdated) {
    res.status(200).json({ record: recordUpdated });
  } else {
    return res.status(424).json({ error: "record was not updated" });
  }
});

//* delete singel item in database operation
const deleteRecord = asyncWrapper(async (req, res) => {
  // getting userId
  const userId = req.header("userId");

  //getting record
  const _id = req.params.id;
  const record = await Record.model.findOne({ _id });
  // record with _id doesn't exist or it exist but belongs to different user
  if (!record || record.userId != userId)
    return res.status(400).json({ error: "No data matches the id : " + _id });

  //deleting and responding
  const recordDelete = await Record.model.deleteOne({ _id });
  if (recordDelete) {
    res
      .status(200)
      .json({ _id: _id, msg: "record with id " + _id + " was deleted" });
  } else {
    return res.status(424).json({ error: "record was not deleted" });
  }
});

module.exports = {
  getAllRecords,
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord,
};
