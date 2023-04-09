const { errorType } = require("./constant");

const getErrorCode = (errorName) => {
  return errorType[errorName];
};

module.exports = getErrorCode;
