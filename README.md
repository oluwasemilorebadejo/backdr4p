# Backdrop Bank Account Verification API

The Backdrop Bank Account Verification API allows users to verify their bank account details by providing their bank account number, selecting a bank name, and writing their name as registered with their banks. The API uses the Paystack account number resolution API to validate the account details provided by the user.

## Requirements
To complete this challenge, you will need the following:

- Node.js
- NPM or Yarn
- Paystack API credentials
- A GraphQL client to test the queries and mutations
- A database management system, preferably MySQL or PostgreSQL

## Installation
Follow the steps below to install and set up the project on your local machine:

1. Clone the repository to your local machine
2. Install the project dependencies by running npm install or yarn install
3. Create a .env file in the root directory of the project and set the following environment variables: `port` = `5050`
4. Start the server by running npm run dev or yarn dev

## Assumptions
- The database table name is users.
- The Paystack API is used for bank account validation and account name resolution.
- User's account name input is compared to the account name returned by the Paystack API using the Levenshtein Distance algorithm to account for slight variations.
- The application already has a registered user object and sets the is_verified attribute to true when a user account is verified.
- The GraphQL mutation accepts three arguments: user_account_number, user_bank_code, and user_account_name.
- The GraphQL query accepts two arguments: user_account_number and user_bank_code.
- User inputted user_account_name is stored in sentence case.
- The js-levenshtein package is used to compute the Levenshtein Distance.

## GraphQL Mutation

### `addUser`

This mutation verifies the user's bank account details by validating the `account_number` and `account_name` provided by the user against the Paystack API. If the names match, the user is marked as verified in the database and this result is returned to the front end. If the names do not match, the API computes the Levenshtein distance between the user inputted `account_name` and the `account_name` provided by the Paystack API. If the Levenshtein distance is less than or equal to 2, the user is still verified and this result is returned to the front end. The mutation accepts the following arguments:

- `user_account_number` (required): The user's bank account number
- `user_bank_code` (required): The user's bank code
- `user_account_name` : The user's name as registered with their bank

If the validation is successful, the mutation returns a JSON object containing the following fields:

- `is_verified`: A boolean value indicating whether the validation was successful or not

### Example

graphql

`mutation {   addUser(     user_account_number: "0157148304",     user_bank_code: "011",     user_account_name: "Stand to End Rape Initiative"   ) {     user_bank_code     user_account_name     is_verified     id     } }`

## GraphQL Query

### `user`

This query returns the account name associated with the given bank account number and bank code. The query first checks if the account name was previously provided by the user and returns this value if it exists. Otherwise, the query makes a call to the Paystack API to retrieve the account name associated with the given account number and bank code. The query returns the account name in sentence case. The query accepts the following arguments:

- `account_number` (required): The bank account number
- `bank_code` (required): The bank code

If the account name is successfully retrieved, the query returns a JSON object containing the following field:

- `user_account_name`: The account name associated with the given bank account number and bank code

### Example

graphql

`query {   getUser(account_number: "0157148304", bank_code: "GTB") {     user_account_name     } }`

## Testing

To test the API, run the following command:

arduinoCopy code

`npm test`

This will run the unit tests located in the `app.test.js` file. The tests cover the following scenarios:

- A valid bank account number and account name are provided
- A valid bank account number and incorrect account name are provided, but the Levenshtein distance is less than or equal to 2
- A valid bank account number and incorrect account name are provided, and the Levenshtein distance is greater than 2
- An invalid bank account number or bank code is provided
- The `user` query returns the user-provided account name
- The `user` query returns the account name provided by Paystack

### Levenshtein Distance vs Damerau-Levenshtein Distance

In this case, we are only interested in measuring the number of insertions, deletions, or substitutions needed to transform one string into another, and not in measuring the number of transpositions, so the pure Levenshtein Distance algorithm might be more efficient than the Damerau-Levenshtein Distance algorithm. The Damerau–Levenshtein Distance algorithm requires additional computational overhead to detect and account for transpositions, which may not be necessary or useful for this particular use case.
