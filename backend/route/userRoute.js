const express = require("express");
const router = express.Router();
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
}= require ("../controller/userController.js");

// Register a new user
router.post("/register", registerRoute);

// Log in a user
router.post("/login", loginRoute);

// Get a specific user by ID
router.get("/:id", getUser);

// Get all users
router.get("/", getUsers);

// Update user information
router.put("/edit", updateUser);

// Delete a user by ID
router.delete("/delete/:id", deleteUser);

// Add a book to user's favorites
router.put("/addFav", addFavourites);

// Get a user's favorite books
router.get("/getfav/:id", getFavourites);

// Remove a book from user's favorites
router.put("/deletefav", deleteFavourites);

// Get information about books in hand, rented history, and requested books for a user
router.get("/get/bookinhand/:id", getBookInHand);

module.exports = router;
