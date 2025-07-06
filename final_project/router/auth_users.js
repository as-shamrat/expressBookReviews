const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "ahraihan", password: "123456" }];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const userWithThisName = users.filter((user) => user.username === username);
  return userWithThisName.length > 0 ? false : true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const validUser = users.filter(
    (user) => user.username === username && user.password === password
  );
  return validUser.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username: username }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = { accessToken: token, username };
    return res
      .status(200)
      .json({ message: "Successfully logged in", user: { username, token } });
  } else {
    return res.status(404).json({ message: "User already exists!" });
  }

  return res.status(300).json({ message: "Yet to be implemented" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  console.log("reviews: ", reviews, "requested review : ", req.body.review);
  if (req.username in reviews) {
    books[isbn].reviews = { ...reviews, [req.username]: req.body.review };
  } else {
    books[isbn].reviews[req.username] = req.body.review;
  }
  console.log("updated reviews: ", books[isbn].reviews);
  return res.status(202).json({
    message: "Book review updated",
    review: {
      username: req.username,
      review: books[isbn].reviews[req.username],
    },
  });
});

// Delete a book review

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  console.log("reviews: ", reviews, "requested review : ", req.body.review);
  delete books[isbn].reviews[req.username];
  console.log("updated reviews: ", books[isbn].reviews);
  return res.status(202).json({
    message: "Book review deleted by " + req.username + " .",
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
