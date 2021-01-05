const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const auth = require("../middleware/authorization");
const { User } = require("../models/user");
const { Container, validateContainer } = require("../models/container");

router.get("/", auth, async (req, res) => {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "jwtPrivateKey");

  const user = await User.findOne({ deviceID: decoded.deviceID });

  res.send(user.containers);
});

router.post("/", auth, async (req, res) => {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, "jwtPrivateKey");

  const { error } = validateContainer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ deviceID: decoded.deviceID });
  const con = user.containers;
  const cont = con.find((o) => o.containerID === req.body.containerID);
  if (cont) return res.status(400).send("Container already fulled.");

  const container = new Container({
    patientID: req.body.patientID,
    containerID: req.body.containerID,
    isFull: req.body.isFull,
    time: req.body.time,
    noOfPills: req.body.noOfPills,
  });

  await User.findOneAndUpdate(
    { deviceID: decoded.deviceID },
    { $push: { containers: container } },
    { new: true }
  );

  return res.send("succeessfully added..");
});

module.exports = router;
