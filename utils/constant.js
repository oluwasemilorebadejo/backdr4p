exports.errorName = {
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  SERVER_ERROR: "INTERNAL SERVER_ERROR",
};

exports.errorType = {
  USER_ALREADY_EXISTS: {
    message: "User already exists.",
    statusCode: 409,
  },
  SERVER_ERROR: {
    message: "Internal Server error.",
    statusCode: 500,
  },
};
