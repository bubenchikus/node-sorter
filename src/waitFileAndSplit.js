const fs = require("fs");
const readline = require("readline");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const availableSpace = {};

function fileSplitter() {
  const filepath = path.resolve(process.env.FILENAME);

  async function processLineByLine() {
    const fileStream = fs.createReadStream(filepath);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let currentFile = 0;
    let currentFileSize = 0;
    const availableMemory =
      parseInt(process.env.RAM_LIMIT) - parseInt(process.env.RESERVED_RAM);
    // const availableMemory = 1000;

    for await (const line of rl) {
      let lineSizeInBytes = Buffer.byteLength(line, "utf8");

      if (currentFileSize + 1 + lineSizeInBytes <= availableMemory) {
        fs.appendFileSync(`${currentFile}.txt`, line + "\n", () => {});
        currentFileSize = fs.statSync(`${currentFile}.txt`).size;
      }
      console.log(`Line from file: ${line}`);
    }
  }

  processLineByLine();
}

function waitFileAndSplit() {
  const checkTime = 1000;
  setTimeout(() => {
    fs.readFile(path.resolve(process.env.FILENAME), "utf8", function (err) {
      if (err) {
        waitFileAndSplit();
      } else {
        return fileSplitter();
      }
    });
  }, checkTime);
}

exports.waitFileAndSplit = waitFileAndSplit;
