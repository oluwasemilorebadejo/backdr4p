<!-- CREATE NEW USER -->

mutation {
addUser(user_account_number: 3122793265, user_bank_code: "011", user_account_name: "ABUBAKRI OLAYIDE ABDUL-LATEEF") {
user_account_number
user_bank_code
user_account_name
is_verified
id
}
}

<!-- GET USER -->

{
user(user_account_number:3122793265, user_bank_code: "011") {
user_account_name
user_account_number
id
is_verified
}
}

<!-- 'GET ALL USERS -->

{
users {
user_account_name
user_account_number
id
is_verified
}
}
