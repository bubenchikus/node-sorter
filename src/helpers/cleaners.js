const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

function cleanUpByRegex(regex) {
  fs.readdirSync(path.resolve())
    .filter((f) => regex.test(f))
    .map((f) => fs.unlinkSync(path.resolve(f)));
}

function cleanUpChunks() {
  console.info("Cleaning up chunk files...");
  cleanUpByRegex(/\d.txt$/);
}

function cleanUpAllTxt() {
  console.info("Cleaning up all .txt files...");
  cleanUpByRegex(/[.]txt$/);
}

function cleanUpSorted() {
  console.info("Cleaning up sorted file...");
  const filepath = path.resolve(process.env.SORTED_FILENAME);
  fs.stat(filepath, (err) => {
    if (!err) {
      fs.unlinkSync(filepath);
    }
  });
}

exports.cleanUpChunks = cleanUpChunks;
exports.cleanUpAllTxt = cleanUpAllTxt;
exports.cleanUpSorted = cleanUpSorted;
