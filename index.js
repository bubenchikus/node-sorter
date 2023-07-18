const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.listen(process.env.PORT, async (err) => {
  if (err) return console.log(err);
  console.log(`Server is OK and running on port ${process.env.PORT}...`);
});
