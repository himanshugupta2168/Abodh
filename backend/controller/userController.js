const User = require("../model/userModel.js");
const bcrypt = require("bcrypt");

// Route to register a new user
exports.registerRoute = async (req, res, next) => {
  const admins = ["admin@123.com"];
  const saltRounds = 10;
  const hashedPass = bcrypt.hashSync(req.body.password, saltRounds);

  try {
    const checkUserAvail = await User.findOne({ email: req.body.email });

    if (checkUserAvail) {
      return next({
        status: 401,
        message: "User already found!",
      });
    } else {
      const newUser = new User({
        ...req.body,
        password: hashedPass,
        isAdmin: admins.includes(req.body.email),
        membership: false,
      });

      const saveUser = await newUser.save();

      res.status(200).json({
        id: saveUser?._id,
        username: saveUser?.username,
        email: saveUser?.email,
        isAdmin: saveUser?.isAdmin,
        favourite: saveUser?.favourites,
        membership: saveUser?.membership,
        bookInHand: saveUser?.bookInHand,
        rentedHistory: saveUser?.rentedHistory,
        requestedBooks: saveUser?.requestedBooks,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Route to log in a user
exports.loginRoute = async (req, res, next) => {
  try {
    const checkUserAvail = await User.findOne({ email: req.body.email });

    if (checkUserAvail) {
      const checkPass = await bcrypt.compare(
        req.body.password,
        checkUserAvail.password
      );

      if (!checkPass) {
        return next({
          status: 401,
          message: "Incorrect username and password!",
        });
      } else {
        res.status(200).json({
          id: checkUserAvail?._id,
          username: checkUserAvail?.username,
          email: checkUserAvail?.email,
          isAdmin: checkUserAvail?.isAdmin,
          favourite: checkUserAvail?.favourites,
          membership: checkUserAvail?.membership,
          rentedHistory: checkUserAvail?.rentedHistory,
          bookInHand: checkUserAvail?.bookInHand,
          requestedBooks: checkUserAvail?.requestedBooks,
        });
      }
    } else {
      return next({
        status: 404,
        message: "User not found!",
      });
    }
  } catch (err) {
    next(err);
  }
};

// Route to get a specific user by ID
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.id });

    res.status(200).json({
      favourite: user?.favourites,
      membership: user?.membership,
      rentedHistory: user?.rentedHistory,
      bookInHand: user?.bookInHand,
      requestedBooks: user?.requestedBooks,
    });
  } catch (err) {
    next(err);
  }
};

// Route to get all non-admin users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find(
      { isAdmin: false },
      {
        password: 0,
      }
    );

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// Route to update a user
exports.updateUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate({ _id: req.body.id }, req.body);

    res.status(200).json({
      message: "User updated successfully!",
    });
  } catch (err) {
    next(err);
  }
};

// Route to delete a user by ID
exports.deleteUser = async (req, res, next) => {
  try {
    const delUser = await User.findById({ _id: req.params.id });

    if (delUser) {
      await User.findByIdAndDelete({ _id: delUser._id });

      res.status(200).json({
        message: "User deleted successfully!",
      });
    } else {
      res.status(404).json({
        message: "User not found!",
      });
    }
  } catch (err) {
    next(err);
  }
};

// Route to add a book to user's favorites
exports.addFavourites = async (req, res, next) => {
  try {
    const checkAlreadyInFav = await User.find({
      $and: [
        { _id: req.body.userId },
        { favourites: { $in: req.body.bookId } },
      ],
    });

    if (checkAlreadyInFav.length === 0) {
      await User.findByIdAndUpdate(
        { _id: req.body.userId },
        { $push: { favourites: req.body.bookId } }
      );

      res.status(200).json({
        message: "Book added to your favorites!",
      });
    } else {
      res.status(403).json({
        message: "Already found in your favorites!",
      });
    }
  } catch (err) {
    next(err);
  }
};

// Route to get a user's favorite books
exports.getFavourites = async (req, res, next) => {
  try {
    const userFavs = await User.find({ _id: req.params.id }, { favourites: 1 });

    res.status(200).json(userFavs[0]?.favourites);
  } catch (err) {
    next(err);
  }
};

// Route to remove a book from user's favorites
exports.deleteFavourites = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      { _id: req.body.userId },
      { $pull: { favourites: req.body.bookId } }
    );

    res.status(200).json({
      message: "Book removed from favorites!",
    });
  } catch (err) {
    next(err);
  }
};

// Route to get information about books in hand, rented history, and requested books for a user
exports.getBookInHand = async (req, res, next) => {
  try {
    const extraInfo = await User.findById(
      { _id: req.params.id },
      { bookInHand: 1, requestedBooks: 1, rentedHistory: 1 }
    );

    res.status(200).json({
      bookInHand: extraInfo?.bookInHand,
      rentedHistory: extraInfo?.rentedHistory,
      requestedBooks: extraInfo?.requestedBooks,
    });
  } catch (err) {
    next(err);
  }
};
