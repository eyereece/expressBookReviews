const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered" });
      } else {
          return res.status(404).json({ message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
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

// Function to fetch list of books using Promise 
function getbookListWithPromise(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => resolve(response.data))
      .catch(error => reject(error))
  });
}

// Function to fetch book list with async-await
async function getBookListAsync(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    throw e;
  }
}

// Endpoint to get book list with Promises
public_users.get('/promise', function(req, res) {
  try {
    getbookListWithPromise('http://localhost:5000')
      .then(bookList => {
        res.json(bookList);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving books list" });
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Unexpected Error"});
  }
});

// Endpoint to get book list with Async
public_users.get('/async', async function (req, res) {
  try {
    const bookList = await getBookListAsync('http://localhost:5000/');
    res.json(bookList);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error retrieving book list" });
  }
})

// Get book details based on ISBN using Promise callbacks
public_users.get('/promise/isbn/:isbn', function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    getbookListWithPromise("http://localhost:5000/isbn/" + requestedIsbn)
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
});

// Get book details based on ISBN using async await
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const requestedIsbn = req.params.isbn;
    const book = await getBookListAsync("http://localhost:5000/isbn/" + requestedIsbn);
    res.json(book);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Get book details based on author using Promise callbacks
public_users.get('/promise/author/:author', function(req, res) {
  try {
    const requestedAuthor = req.params.author;
    getbookListWithPromise("http://localhost:5000/author/" + requestedAuthor)
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details"});
      })
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Unexpected error" });
  }
});

// Get book details with Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const requestedAuthor = req.params.author;
    const book = await getBookListAsync("http://localhost:5000/author/" + requestedAuthor);
    res.json(book);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Get book details with promise callbacks
public_users.get('/promise/title/:title', function (req, res) {
  try {
    const requestedTitle = req.params.title;
    getbookListWithPromise("http://localhost:5000/title/" + requestedTitle)
      .then(book => {
        res.json(book);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
      })
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Unexpected Error" });
  }
});

// Get book details with Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const requestedTitle = req.params.title;
    const book = await getBookListAsync("http://localhost:5000/title/" + requestedTitle);
    res.json(book);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error retrieving book details"});
  }
});

module.exports.general = public_users;
module.exports.getbookListWithPromise = getbookListWithPromise;
module.exports.getBookListAsync = getBookListAsync;