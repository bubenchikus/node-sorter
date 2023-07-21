const fs = require("fs");
const { listChunks } = require("./helpers/listChunks");

function sorter() {
  const chunks = listChunks();

  const lineCount = {};

  chunks.forEach((filepath) => {
    console.info(`Sorting ${filepath}...`);

    const arrData = fs.readFileSync(filepath, "utf-8").split("\n");

    lineCount[filepath] = arrData.length;

    arrData.sort((a, b) => {
      // reverse order to place empty lines in the end so they don't confuse
      return b.localeCompare(a);
    });

    fs.unlinkSync(filepath);
    arrData.forEach((line) => fs.appendFileSync(filepath, line + "\n"));
  });
  console.info("Sorting process finished.");

  return lineCount;
}

exports.sorter = sorter;
