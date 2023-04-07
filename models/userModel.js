const { DataTypes } = require("sequelize");

const db = require("../config/database");

const User = db.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_account_number: {
    type: DataTypes.BIGINT,
  },
  user_bank_code: {
    type: DataTypes.STRING,
  },
  user_account_name: {
    type: DataTypes.STRING,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
