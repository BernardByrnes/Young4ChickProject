const bcrypt = require("bcryptjs");

const password = "password1234"; // Change this to a secure password
bcrypt
  .hash(password, 10)
  .then((hash) => {
    console.log("Hashed Password:", hash);
  })
  .catch((err) => console.error(err));
