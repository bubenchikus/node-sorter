const { splitter } = require("./src/splitter");
const { cleanUpSorted, cleanUpChunks } = require("./src/helpers/cleaners");
const { sorter } = require("./src/sorter");
const { merger } = require("./src/merger");
const { measuredTimeMessage } = require("./src/helpers/loggers");

async function main() {
  cleanUpSorted();
  cleanUpChunks();

  const time_1 = performance.now();
  await splitter();
  const time_2 = performance.now();
  measuredTimeMessage(time_1, time_2);

  const time_3 = performance.now();
  sorter();
  const time_4 = performance.now();
  measuredTimeMessage(time_3, time_4);

  const time_5 = performance.now();
  await merger();
  const time_6 = performance.now();
  measuredTimeMessage(time_5, time_6);

  cleanUpChunks();
}

main();
