const { ConvertDate } = require("../utils/ConvertDate");
const { ConvertTime } = require("../utils/ConvertTime");

const messageBody = (timein, guardian, student, time, section, adviser) => {
  const body = `Good day! ${guardian}, ${student} ${timein ? "attended" : "time-out"} class at ${ConvertTime(time)} ${ConvertDate(time)}. ${section} - ${adviser}`;

  return body;
};

module.exports = {
  messageBody,
};
