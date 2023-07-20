const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

function generateLineWithLength(stringSize) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  // - 1 byte for a newline
  while (Buffer.byteLength(result, "utf8") < stringSize - 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result + "\n";
}

function generateLine(sizeLimit) {
  const maxLineLength = process.env.LINE_SIZE_LIMIT; //bytes
  if (sizeLimit > maxLineLength) {
    return generateLineWithLength(
      Math.floor(Math.random() * maxLineLength + 1)
    );
  } else {
    return generateLineWithLength(sizeLimit);
  }
}

function fileGenerator() {
  const filepath = path.resolve(process.env.FILENAME);

  // use stat to check if file exists
  fs.stat(filepath, (err) => {
    if (err) {
      // create file if does not exist
      if (err.code === "ENOENT") {
        fs.open(filepath, "w", (err) => {
          if (err) return console.warn(err.message);
          console.info("New empty file successfully created.");

          const maxFileSize = parseInt(process.env.FILESIZE);
          let currentSize = 0;

          console.info("Populating file with random strings...");

          while (currentSize < maxFileSize) {
            const newLine = generateLine(maxFileSize - currentSize);

            fs.appendFileSync(filepath, newLine);

            currentSize = fs.statSync(filepath).size;
          }

          console.info("File successfully populated.");
        });
      } else {
        return console.warn(err.message);
      }
    }
  });
}

fileGenerator();
