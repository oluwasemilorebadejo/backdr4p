const app = require("./app");
const request = require("supertest");

describe("GraphQL API", () => {
  test("Levenshtein distance is less than or equals 2, should create user account successfully", async () => {
    const query = `
    mutation {
      addUser(user_account_number: 3122793265, user_bank_code: "011", user_account_name: "ABUBAKRI OLAYIDE ABDUL-LATEEF") {
       user_account_number
       user_bank_code
       user_account_name
       is_verified
       id
      }
     }
    `;

    const response = await request(app)
      .post("/graphql")
      .send({ query })
      .expect(200);

    expect(response.body).toEqual({
      data: {
        addUser: {
          user_account_number: 3122793265,
          user_bank_code: "011",
          user_account_name: "ABUBAKRI OLAYIDE ABDUL-LATEEF",
          is_verified: true,
          id: expect.any(String),
        },
      },
    });
  });

  test("Levenshtein distance is greater than 2, should not create user account and return error", async () => {
    const query = `
    mutation {
      addUser(user_account_number: 3122793265, user_bank_code: "011", user_account_name: "ABUBAKRI ABDUL-LATEEF OLAYIDE") {
       user_account_number
       user_bank_code
       user_account_name
       is_verified
       id
      }
     }
    `;

    const response = await request(app)
      .post("/graphql")
      .send({ query })
      .expect(200);

    expect(response.body).toEqual({
      data: {
        addUser: {
          user_account_number: 3122793265,
          user_bank_code: "011",
          user_account_name: "ABUBAKRI ABDUL-LATEEF OLAYIDE",
          is_verified: false,
          id: expect.any(String),
        },
      },
    });
  });

  test("should return user account details when queried with valid account number and bank code", async () => {
    const query = `
      query {
        user(user_account_number:3122793265, user_bank_code: "011") {
          user_account_name
          user_account_number
          id
          is_verified
        }
      }
    `;
    const response = await request(app)
      .post("/graphql")
      .send({ query })
      .expect(200);
    expect(response.body).toEqual({
      data: {
        user: {
          user_account_name: "Abubakri Olayide Abdul-lateef",
          user_account_number: 3122793265,
          id: expect.any(String),
          is_verified: true,
        },
      },
    });
  });

  test("should return an error when queried with an incomplete account number", async () => {
    const query = `
      query {
        user(user_account_number: 1234, user_bank_code: "058") {
          user_account_name
          user_account_number
          id
          is_verified
        }
      }
    `;
    const response = await request(app)
      .post("/graphql")
      .send({ query })
      .expect(200);
    expect(response.body).toEqual({
      data: {
        user: null,
      },
      errors: [
        {
          message:
            "The account number is not complete. Check the number of digits and try again",
          statusCode: 400,
        },
      ],
    });
  });

  test("should return an error when queried with an account number that doesnt exist", async () => {
    const query = `
      query {
        user(user_account_number: 1234567890, user_bank_code: "058") {
          user_account_name
          user_account_number
          id
          is_verified
        }
      }
    `;
    const response = await request(app)
      .post("/graphql")
      .send({ query })
      .expect(200);
    expect(response.body).toEqual({
      data: {
        user: null,
      },
      errors: [
        {
          message:
            "User doesnt exit. Kindly check if the account number is correct",
          statusCode: 400,
        },
      ],
    });
  });
});
