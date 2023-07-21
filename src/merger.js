const fs = require("fs");
const dotenv = require("dotenv");
const { listChunks } = require("./helpers/listChunks");
const readline = require("readline");

dotenv.config();

async function findLine(filepath, index) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filepath),
    crlfDelay: Infinity,
  });

  let counter = 0;

  for await (const line of rl) {
    if (counter === index) {
      return line;
    }
    counter++;
  }
  return "";
}

function promiseFirstLines(chunks) {
  const promisedLines = [];

  chunks.forEach((filepath) => {
    promisedLines.push(findLine(filepath, 0));
  });

  return promisedLines;
}

async function merger(lineCount = {}) {
  console.info("Merging process started.");
  const chunks = listChunks();

  const info = {};
  chunks.forEach((filepath) => {
    info[filepath] = { index: 0 };
  });

  // to avoid reading full files just to get first line
  const nullLines = await Promise.all(promiseFirstLines(chunks));
  for (let i in chunks) {
    info[chunks[i]].currentLine = nullLines[i];
  }

  while (Object.keys(info).length > 0) {
    const maxFilepath = Object.keys(info).reduce((a, b) =>
      info[b].currentLine.localeCompare(info[a].currentLine) > 0 ? b : a
    );

    fs.appendFileSync(
      process.env.SORTED_FILENAME,
      info[maxFilepath].currentLine + "\n"
    );

    if (info[maxFilepath].index < lineCount[maxFilepath] - 1) {
      info[maxFilepath].index += 1;
      info[maxFilepath].currentLine = await findLine(
        maxFilepath,
        info[maxFilepath].index
      );
    } else {
      console.info(`${maxFilepath} is merged into final sorted file.`);
      delete info[maxFilepath];
    }
  }
  console.info("Merging process finished.");
}
exports.merger = merger;
