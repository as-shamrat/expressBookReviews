const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(404)
      .json({ message: "username and password must be provided" });
  }
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(500).json({ message: "username is taken" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: `Username ${username} is created.` });
});

// Helper function for serving books asynchronously
const getBooks = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  const fetchedBooks = await getBooks();
  return res.status(200).send(JSON.stringify(fetchedBooks));
});

// Helper function to get book by isbn
const getBookByIsbn = (isbn) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      resolve(book);
    }, 2000);
  });

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  // const book = books[req.params.isbn];
  const fetchedBook = await getBookByIsbn(req.params.isbn);
  return res.status(200).send(JSON.stringify(fetchedBook));
});

// Heloper function to get book by author asynchronously
const getBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let book;
      for (let key in books) {
        if (books[key].author === author) {
          book = books[key];
          break;
        }
      }
      resolve(book);
    }, 2000);
  });
};
// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  // let book;
  // for (let key in books) {
  //   if (books[key].author === req.params.author) {
  //     book = books[key];
  //     break;
  //   }
  // }
  const fetchedBook = await getBookByAuthor(req.params.author);
  return res.status(200).json(fetchedBook);
});

// Helper function to get book by title asynchronously
const getBookByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let book;
      for (let key in books) {
        if (books[key].title === title) {
          book = books[key];
          break;
        }
      }
      resolve(book);
    }, 2000);
  });
};

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  // let book;
  // for (let key in books) {
  //   if (books[key].title === req.params.title) {
  //     book = books[key];
  //     break;
  //   }
  // }
  const fetchedBook = await getBookByTitle(req.params.title);
  return res.status(200).json(fetchedBook);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];

  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
