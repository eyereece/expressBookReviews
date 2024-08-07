const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted books data
  res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the ISBN parameter from the request URL and send the corresponding book details
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  // Iterate over the books object to find books by the given author
  for (const id in books) {
    if (books[id].author === author) {
      booksByAuthor.push(books[id]);
    }
  }

  // Check if any books by the given author were found
  if (booksByAuthor.length > 0) {
    return res.json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];

  // Iterate over the books object to find books by the given title
  for (const id in books) {
    if (books[id].title === title) {
      booksByTitle.push(books[id]);
    }
  }

  // Check if any books by the given title were found
  if (booksByTitle.length > 0) {
    return res.json(booksByTitle);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.general = public_users;
