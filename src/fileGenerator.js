const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

function generateLineWithLength(stringSize) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let counter = 0;
  let result = "";

  // minus one byte for a newline
  while (counter < stringSize - 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result + "\n";
}

// function generateLine(sizeLimit) {
//   if (sizeLimit > parseInt(process.env.RAM_LIMIT)) {
//     return generateLineWithLength(
//       Math.floor(Math.random() * (parseInt(process.env.RAM_LIMIT) - 1024 + 1))
//     );
//   } else {
//     return generateLineWithLength(sizeLimit);
//   }
// }

function generateLine(sizeLimit) {
  if (sizeLimit > 100) {
    return generateLineWithLength(Math.floor(Math.random() * (100 + 1)));
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

          try {
            while (currentSize < maxFileSize) {
              const newLine = generateLine(maxFileSize - currentSize);

              fs.appendFileSync(path.resolve(process.env.FILENAME), newLine);

              currentSize = fs.statSync(filepath).size;
            }
          } catch (err) {
            console.warn(
              "Something went wrong while populating file. Deleting it..."
            );
            fs.unlink(filepath, (err) => {
              if (err) {
                return console.warn(err.message);
              }
              console.info("Old file successfully deleted.");
            });
          }

          console.info("File successfully populated.");
        });
      } else {
        return console.warn(err.message);
      }
    }
  });
}

exports.fileGenerator = fileGenerator;
