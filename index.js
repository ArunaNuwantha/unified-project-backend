const express = require("express");
const mongoose = require("mongoose");
const userRegister = require("./routes/register");
const userLogin = require("./routes/login");
const patients = require("./routes/patients");
const containers = require("./routes/containers");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/register", userRegister);
app.use("/api/login", userLogin);
app.use("/api/patients", patients);
app.use("/api/container", containers);

const cloud_mongodb =
  "mongodb+srv://spm-user:1234@cluster0.pps0b.mongodb.net/spmdb?retryWrites=true&w=majority";
const local_mongodb = "mongodb://localhost/project";

mongoose
  .connect(cloud_mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.log("ERROR : ", err));

const port = process.env.PORT || 3900;
app.listen(port, () => console.log(`Listening on PORT ${port}...`));
