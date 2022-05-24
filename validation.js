const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

//* user validation to used when registering
const userValidation = (user) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*s)(?=.{8,})"))
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code == "string.pattern.base") {
            err.message =
              "password must be at least 8 characters, and must contain at least one lowercase character,at least one uppercase character and at least one number ";
          }
        });
        return errors;
      }),
  });

  return schema.validate(user).error;
};

//* login validation

const userLoginValidation = (loginData) => {
  const schema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*s)(?=.{8,})"))
      .error((errors) => {
        errors.forEach((err) => {
          if (err.code == "string.pattern.base") {
            err.message =
              "password must be at least 8 characters, and must contain at least one lowercase character,at least one uppercase character and at least one number ";
          }
        });
        return errors;
      }),
  });

  return schema.validate(loginData).error;
};

//* guest Validation
const guestValidation = (guest) => {
  const voucherSchema = Joi.object({
    holderId: Joi.objectId().required(),
    validUntill: Joi.date().required(),
    createdDate: Joi.date().required().default(new Date()),
    unvalid: Joi.boolean().default(false),
  }).unknown();

  const schema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    roomNumber: Joi.number().required().min(0),
    type: Joi.string().required(),
    validUntill: Joi.date().required(),
    vouchersLis: Joi.array().items(voucherSchema).required(),
    userId: Joi.objectId().required(),
    createdDate: Joi.date().required().default(new Date()),
  }).unknown();

  return schema.validate(guest).error;
};

//* record validation
const recordValidation = (record) => {
  const recordSchema = Joi.object({
    date: Joi.date().required(),
    type: Joi.string().required(),
    guestId: Joi.objectId().required(),
    voucherId: Joi.objectId(),
    userId: Joi.objectId().required(),
  }).unknown();

  return recordSchema.validate(record).error;
};

module.exports = {
  userValidation,
  guestValidation,
  userLoginValidation,
  recordValidation,
};
