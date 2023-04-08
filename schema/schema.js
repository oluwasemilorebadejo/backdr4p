const https = require("https");
const axios = require("axios");
const levenshtein = require("js-levenshtein");

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

    user: {
      type: UserType,
      args: {
        user_account_number: { type: GraphQLFloat },
        user_bank_code: { type: GraphQLString },
      },
      resolve(parent, args) {
        const { user_account_number, user_bank_code } = args;
        return User.findOne({
          where: {
            user_account_number,
            user_bank_code,
          },
        });
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

            return axios(options)
              .then((response) => {
                const resolvedAccountName = response.data.data.account_name;
                const userAccountName = user_account_name.toLowerCase();
                const resolvedAccountNameLower =
                  resolvedAccountName.toLowerCase();
                const ld = levenshtein(
                  userAccountName,
                  resolvedAccountNameLower
                );

                if (ld <= 2) {
                  return user
                    .update({
                      is_verified: true,
                    })
                    .then((updatedUser) => {
                      return { ...updatedUser.dataValues, id: updatedUser.id };
                    });
                } else {
                  return { ...user.dataValues, id: user.id };
                }
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});