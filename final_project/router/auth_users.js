const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const existingUsers = users.filter((u) => u.username === username);
    if(existingUsers.length > 0) return false;
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const existingUsers = users.filter((u) => {return u.username === username && u.password === password});
    if(existingUsers.length > 0) return true;
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;

  books[isbn].reviews = {...books[isbn].reviews, [user]:review};

  return res.status(200).json({message: "Review for the book with ISBN"  + isbn + " has been added."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const user = req.session.authorization.username;
  
    delete books[isbn].reviews[user];
  
    return res.status(200).json({message: "Review for the book with ISBN "  + isbn + " has been deleted for the user."});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
