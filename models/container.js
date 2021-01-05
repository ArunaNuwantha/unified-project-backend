// id, patientID, time, no of medi, isFull

const mongoose = require("mongoose");
const Joi = require("joi");

const containerSchema = new mongoose.Schema({
  containerID: Number,
  patientID: String,
  time: { type: Date, default: Date.now },
  noOfPills: Number,
  isFull: Boolean,
});

const Container = mongoose.model("Container", containerSchema);

function validateContainer(container) {
  const schema = Joi.object({
    containerID: Joi.number().min(1).max(12).required(),
    patientID: Joi.string().required().min(2).max(50),
    noOfPills: Joi.number(),
    isFull: Joi.bool(),
  });
  return schema.validate(container);
}

module.exports.containerSchema = containerSchema;
module.exports.Container = Container;
module.exports.validateContainer = validateContainer;
