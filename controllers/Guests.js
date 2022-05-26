const Guest = require("../models/Guest");

const asyncWrapper = require("../middleware/async");
const { guestValidation } = require("../validation");
const { json } = require("express");

//* getting all the data operation

const getAllGuests = asyncWrapper(async (req, res) => {
  // getting userId
  const userId = req.header("userDataId");

  //response with only the guests that have the userId
  const guests = await Guest.model.find(req.query);
  res.status(200).json({
    guests: guests.filter((item) => {
      return (item.userId = userId);
    }),
  });
});

//* add item to database

const createGuest = asyncWrapper(async (req, res) => {
  // getting userId
  const userDataId = req.header("userDataId");

  // updating guest object with userId and vouchers holderId
  const guest = new Guest.model(req.body);
  guest.userDataId = userDataId;
  for (let i = 0; i < guest.vouchersLis.length; i++) {
    guest.vouchersLis[i].holderId = guest._id;
  }

  //validation
  const error = guestValidation(guest);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  //creating the guest and responding
  const guestCreated = await Guest.model.create(guest);
  res.status(201).json({ guest: guestCreated });
});

//* getting singel item in database operation
const getGuest = asyncWrapper(async (req, res) => {
  // getting userId
  const userId = req.header("userDataId");

  //getting guest
  const _id = req.params.id;
  const guest = await Guest.model.findOne({ _id });
  // guest with _id doesn't exist or it exist but belongs to different user
  if (!guest || guest.userDataId != userId)
    return res.status(400).json({ error: "No data matches the id : " + _id });

  // response
  res.status(200).json({ guest: guest });
});

//* updating singel item in database operation
const updateGuest = asyncWrapper(async (req, res) => {
  // getting userId
  const userDataId = req.header("userDataId");

  //getting guest to update
  const _id = req.params.id;
  const guest = await Guest.model.findOne({ _id });
  // guest with _id doesn't exist or it exist but belongs to different user
  if (!guest || guest.userDataId != userDataId)
    return res.status(400).json({ error: "No data matches the id : " + _id });

  //validating newGuest data
  const newGuest = new Guest.model({ ...req.body, _id });
  newGuest.userDataId = userDataId;
  for (let i = 0; i < newGuest.vouchersLis.length; i++) {
    newGuest.vouchersLis[i].holderId = _id;
  }
  const error = guestValidation(newGuest);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // updating the guest and responding
  const guestUpdated = await Guest.model.findOneAndUpdate({ _id }, newGuest, {
    new: true,
    runValidators: true,
  });
  if (guestUpdated) {
    res.status(200).json({ guest: guestUpdated });
  } else {
    return res.status(424).json({ error: "guest was not updated" });
  }
});

//* delete singel item in database operation
const deleteGuest = asyncWrapper(async (req, res) => {
  // getting userId
  const userId = req.header("userDataId");

  //getting guest
  const _id = req.params.id;
  const guest = await Guest.model.findOne({ _id });
  // guest with _id doesn't exist or it exist but belongs to different user
  if (!guest || guest.userDataId != userId)
    return res.status(400).json({ error: "No data matches the id : " + _id });

  //deleting and responding
  const guestDelete = await Guest.model.deleteOne({ _id });
  if (guestDelete) {
    res
      .status(200)
      .json({ _id: _id, msg: "guest with id " + _id + " was deleted" });
  } else {
    return res.status(424).json({ error: "guest was not deleted" });
  }
});

module.exports = {
  getAllGuests,
  createGuest,
  getGuest,
  updateGuest,
  deleteGuest,
};
