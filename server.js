const db = require("./config/database");

// Test DB Connection
db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const app = require("./app");

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
