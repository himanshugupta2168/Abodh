const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const app = express();
const corsOptions = {
  origin: '*',
};

const {
  bookRoute,
  booksRoute,
  categoryRoute,
  createBook,
  getAllRentalsRoute,
  moveToRentedRoute,
  requestedBooksRoute,
  requestRoute,
  returnedStatChange,
} = require( "./controller/bookController.js");


const{
  addFavourites,
  deleteFavourites,
  deleteUser,
  getBookInHand,
  getFavourites,
  getUser,
  getUsers,
  loginRoute,
  registerRoute,
  updateUser,
}= require ("./controller/userController.js");


const mongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB server started successfully!`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// MIDDLEWARES.
app.use(cors(corsOptions));
app.use(express.json()); // To parse JSON objects.

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    status: err.status,
    stack: err.stack,
  });
});
// book routes
app.get("/books/", booksRoute);

// Get a specific book by ID
app.get("/books/:id", bookRoute);

// Get all books of a specific type/category
app.get("/books/all/:type", categoryRoute);

// Create a new book
app.post("/books/create", createBook);

// Request a book from admin
app.post("/books/request", requestRoute);

// Get all requested books
app.get("/books/request/all", requestedBooksRoute);

// Get all rented books
app.get("/books/rentals/all", getAllRentalsRoute);

// Move a requested book to rented status
app.post("/books/request/one", moveToRentedRoute);

// Update the status when a book is returned
app.put("/books/returned/update", returnedStatChange);



// user routes
app.post("/user/register", registerRoute);

// Log in a user
app.post("/user/login", loginRoute);

// Get a specific user by ID
app.get("/user/:id", getUser);

// Get all users
app.get("/user/", getUsers);

// Update user information
app.put("/user/edit", updateUser);

// Delete a user by ID
app.delete("/user/delete/:id", deleteUser);

// Add a book to user's favorites
app.put("/user/addFav", addFavourites);

// Get a user's favorite books
app.get("/user/getfav/:id", getFavourites);

// Remove a book from user's favorites
app.put("/user/deletefav", deleteFavourites);

// Get information about books in hand, rented history, and requested books for a user
app.get("/user/get/bookinhand/:id", getBookInHand);







app.get('/', (req, res) => {
  return res.json('Hello, this is your API!');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  mongo();
  console.log(`Server started on port ${PORT}`);
});
