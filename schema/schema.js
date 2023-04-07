const https = require("https");
const axios = require("axios");

const User = require("../models/userModel");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLScalarType,
  GraphQLBoolean,
} = require("graphql");
const { response } = require("express");

let bankData = null;

const options = {
  method: "GET",
  url: "https://api.paystack.co/bank?country=nigeria",
  headers: {
    Authorization: "Bearer sk_test_b7d166703d2c8883b42f764b528ce128a114743f",
  },
};

axios(options)
  .then((response) => {
    bankData = response.data;
  })
  .catch((error) => {
    console.error("BANK DATA ERROR: ", error);
  });

// setTimeout(() => {
//   console.log(bankData);
// }, 2000);

// user type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    user_account_number: { type: GraphQLFloat },
    user_bank_code: { type: GraphQLString },
    user_account_name: { type: GraphQLString },
    is_verified: { type: GraphQLBoolean, defaultValue: false },
  }),
});

// query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.findAll();
      },
    },
    client: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findOne({ where: { id } });
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        user_account_number: { type: GraphQLFloat },
        user_bank_code: { type: GraphQLString },
        user_account_name: { type: GraphQLString },
        is_verified: { type: GraphQLBoolean, defaultValue: false },
      },
      resolve(parent, args) {
        // create a new user with the provided arguments and the default value
        // i can decide to verify the account from here
        const {
          user_account_number,
          user_bank_code,
          user_account_name,
          is_verified,
        } = args;

        return User.create({
          user_account_number,
          user_bank_code,
          user_account_name,
          is_verified,
        })
          .then((user) => {
            const options = {
              method: "GET",
              url: "https://api.paystack.co/bank/resolve",
              params: {
                account_number: user.user_account_number,
                bank_code: user.user_bank_code,
              },
              headers: {
                Authorization:
                  "Bearer sk_test_b7d166703d2c8883b42f764b528ce128a114743f",
              },
            };

            axios(options)
              .then((response) => {
                // console.log(response.data);

                if (user.user_account_name == response.data.data.account_name) {
                  user.is_verified = true;
                  user.save();
                }
              })
              .catch((error) => {
                console.error(error);
              });

            // Return an object that contains the user object and the id
            return { ...user.dataValues, id: user.id };
          })
          .catch((error) => {
            console.error(error);
          });
      },
    },
    verifyUser: {
      type: UserType,
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
