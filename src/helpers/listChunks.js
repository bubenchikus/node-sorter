const fs = require("fs");
const path = require("path");

function listChunks() {
  return fs
    .readdirSync(path.resolve())
    .filter((f) => /\d.txt$/.test(f))
    .map((fileName) => path.resolve(fileName));
}

exports.listChunks = listChunks;
