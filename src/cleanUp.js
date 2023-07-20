const fs = require("fs");
const path = require("path");

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

exports.cleanUpChunks = cleanUpChunks;
exports.cleanUpAllTxt = cleanUpAllTxt;
