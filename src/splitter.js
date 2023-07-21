const fs = require("fs");
const readline = require("readline");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

function writeLineToFile(num, line) {
  fs.appendFileSync(path.resolve(`${num}.txt`), line + "\n");
}

async function splitter() {
  const fileSize =
    parseInt(process.env.RAM_LIMIT) - parseInt(process.env.RAM_RESERVED);
  console.info(
    `Splitting process started. Chunk filesize will be ${Math.ceil(
      fileSize / (1024 * 1024)
    )} MiB.`
  );

  const filepath = path.resolve(process.env.FILENAME);

  const rl = readline.createInterface({
    input: fs.createReadStream(filepath),
    crlfDelay: Infinity,
  });

  const freeSpace = [fileSize];

  // iterating through lines and passing them to smaller files
  for await (const line of rl) {
    const lineSizeInBytes = Buffer.byteLength(line, "utf8");

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
      freeSpace.push(fileSize - lineSizeInBytes - 1);
    }
  }
  console.info("Splitting process finished.");
}

exports.splitter = splitter;
