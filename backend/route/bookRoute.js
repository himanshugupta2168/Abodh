const express = require("express");
const router = express.Router();
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
} = require( "../controller/bookController.js");

// Get all books
router.get("/", booksRoute);

// Get a specific book by ID
router.get("/:id", bookRoute);

// Get all books of a specific type/category
router.get("/all/:type", categoryRoute);

// Create a new book
router.post("/create", createBook);

// Request a book from admin
router.post("/request", requestRoute);

// Get all requested books
router.get("/request/all", requestedBooksRoute);

// Get all rented books
router.get("/rentals/all", getAllRentalsRoute);

// Move a requested book to rented status
router.post("/request/one", moveToRentedRoute);

// Update the status when a book is returned
router.put("/returned/update", returnedStatChange);

module.exports = router;