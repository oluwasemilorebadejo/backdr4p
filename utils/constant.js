exports.errorName = {
  USER_DOESNT_EXIST: "USER_DOESNT_EXIST",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  SERVER_ERROR: "SERVER_ERROR",
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
};
