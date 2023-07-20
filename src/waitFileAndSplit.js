const fs = require("fs");
const readline = require("readline");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

function makeFileName(num) {
  return path.resolve(`${num}.txt`);
}

function writeLineToFile(num, line) {
  fs.appendFileSync(makeFileName(num), line + "\n", () => {});
}

async function fileSplitter() {
  console.info("Splitting process started.");

  const filepath = path.resolve(process.env.FILENAME);

  const fileStream = fs.createReadStream(filepath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const freeSpace = [parseInt(process.env.RAM_LIMIT)];

  // iterating through lines and passing them to smaller files
  for await (const line of rl) {
    let lineSizeInBytes = Buffer.byteLength(line, "utf8");

    let spaceFound = 0;

    for (let i = 0; i < freeSpace.length; i++) {
      // -1 byte for a newline
      if (lineSizeInBytes <= freeSpace[i] - 1) {
        writeLineToFile(i, line);
        freeSpace[i] = freeSpace[i] - lineSizeInBytes - 1;
        spaceFound = 1;
        break;
      }
    }

    // no existing files had enough space for line, so we create a new file
    if (!spaceFound) {
      writeLineToFile(freeSpace.length, line);
      freeSpace.push(parseInt(process.env.RAM_LIMIT) - lineSizeInBytes - 1);
    }
  }
  console.info("Splitting process finished.");
}

exports.fileSplitter = fileSplitter;
