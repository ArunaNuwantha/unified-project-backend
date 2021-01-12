const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const auth = require("../middleware/authorization");
const { User } = require("../models/user");
const { Patient, validatePatient } = require("../models/patient");

router.get("/", auth, async (req, res) => {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "jwtPrivateKey");
  user = await User.findOne({ email: decoded.email });
  res.send(user.patients);
});

router.post("/", auth, async (req, res) => {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "jwtPrivateKey");

  const { error } = validatePatient(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const patient = new Patient({
    name: req.body.name,
    age: req.body.age,
  });

  let user = await User.findOneAndUpdate(
    { deviceID: decoded.deviceID },
    { $push: { patients: patient } },
    { new: true }
  );

  return res.send("Patient added successfully...");
});

module.exports = router;
