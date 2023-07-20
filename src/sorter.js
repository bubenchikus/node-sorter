const fs = require("fs");
const path = require("path");
const os = require("os");

function sorter() {
  const osFreeMem = os.freemem();
  const allFreeMem = osFreeMem / (1024 * 1024);
  console.log(`Total free memory: ${allFreeMem} MiB.`);

  const chunks = fs
    .readdirSync(path.resolve())
    .filter((f) => /\d.txt$/.test(f))
    .map((fileName) => path.resolve(fileName));

  chunks.forEach((filepath) => {
    console.info(`Sorting ${filepath}...`);

    var text = fs.readFileSync(filepath, "utf-8");
    var arrData = text.split("\n");
    arrData.sort((a, b) => {
      // reverse order to place empty lines in the end so they don't confuse
      return b.localeCompare(a);
    });

    fs.unlinkSync(filepath);
    arrData.forEach((line) => fs.appendFileSync(filepath, line + "\n"));
  });
  console.info("Sorting process finished.");
}

exports.sorter = sorter;
