function measuredTimeMessage(time_1, time_2) {
  console.info(
    `(It took about ${Math.round(
      (time_2 - time_1) / 1000
    )} seconds to finish this task).`,
    "\n" + "-".repeat(20)
  );
}

exports.measuredTimeMessage = measuredTimeMessage;
