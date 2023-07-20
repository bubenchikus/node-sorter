const express = require("express");
const dotenv = require("dotenv");

const { fileSplitter } = require("./src/waitFileAndSplit");
const { cleanUpChunks } = require("./src/cleanUp");
const { sorter } = require("./src/sorter");

dotenv.config();

const app = express();

app.listen(process.env.PORT, async (err) => {
  if (err) return console.warn(err);
  console.info(`Server is OK and running on port ${process.env.PORT}.`);

  cleanUpChunks();
  await fileSplitter();
  sorter();
});
