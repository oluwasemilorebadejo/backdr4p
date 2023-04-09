const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema/schema");
const getErrorCode = require("./utils/getErrorCode");

const app = express();

app.use("/graphql", (req, res) => {
  graphqlHTTP({
    schema,
    graphiql: true,
    context: { req },
    customFormatErrorFn: (err) => {
      const error = getErrorCode(err.message);
      return { message: error.message, statusCode: error.statusCode };
    },
  })(req, res);
});

module.exports = app;
