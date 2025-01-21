const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(300).json({ message: "No username or password provided." });

    const existingUsers = users.filter((u) => u.username === username);

    if (existingUsers.length > 0) return res.status(300).json({ message: "User already exists" });

    users.push({ username, password });

    return res.status(200).json({ message: "Customer successfully registered!  You can now log in." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    return await new Promise((resolve, reject) => {
        resolve(res.status(200).json({ books }))
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    return new Promise((resolve, reject) => {
        let filteredBooks = books[req.params.isbn];
        resolve(res.status(200).json(filteredBooks));
    });
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    return new Promise((resolve, reject) => {
        let booksByAuthor = [];
        for (const key in books) {
            if (books[key].author === req.params.author) {
                booksByAuthor.push(books[key]);
            }
        }
        resolve(res.status(200).json({ booksByAuthor }));
    })
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    return new Promise((resolve, reject) => {
        let booksByTitle = [];
        for (const key in books) {
            if (books[key].title === req.params.title) {
                booksByTitle.push(books[key]);
            }
        }
        resolve(res.status(200).json({ booksByTitle }));
    })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let filteredBooks = books[req.params.isbn];
    return res.status(200).json(filteredBooks.reviews);
});

module.exports.general = public_users;
