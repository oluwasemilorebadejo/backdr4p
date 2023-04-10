exports.errorName = {
  USER_DOESNT_EXIST: "USER_DOESNT_EXIST",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  SERVER_ERROR: "SERVER_ERROR",
  ACCOUNT_NUMBER_LENGTH_ERROR: "ACCOUNT_NUMBER_LENGTH_ERROR",
  INVALID_BANK_DETAILS: "INVALID_BANK_DETAILS",
};

exports.errorType = {
  USER_DOESNT_EXIST: {
    message: "User doesnt exit. Kindly check if the account number is correct",
    statusCode: 400,
  },
  USER_ALREADY_EXISTS: {
    message: "User already exists.",
    statusCode: 409,
  },
  SERVER_ERROR: {
    message: "Internal Server error.",
    statusCode: 500,
  },
  ACCOUNT_NUMBER_LENGTH_ERROR: {
    message:
      "The account number is not complete. Check the number of digits and try again",
    statusCode: 400,
  },
  INVALID_BANK_DETAILS: {
    message:
      "Bank account number and/or bank code is invalid. Kindly check again",
    statusCode: 400,
  },
};
