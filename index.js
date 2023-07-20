const express = require("express");
const dotenv = require("dotenv");

const { fileGenerator } = require("./src/fileGenerator");
const { waitFileAndSplit } = require("./src/waitFileAndSplit");

dotenv.config();

const app = express();

app.listen(process.env.PORT, (err) => {
  if (err) return console.log(err);
  console.log(`Server is OK and running on port ${process.env.PORT}.`);

  fileGenerator();
  waitFileAndSplit();
});
