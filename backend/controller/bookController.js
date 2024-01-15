const Books = require("../model/bookModel.js");
const Request = require("../model/requestModel.js");
const User = require("../model/userModel.js");
const Rented = require("../model/rentedModel.js");

exports.booksRoute = async (req, res, next) => {
  try {
    const allBooks = await Books.find();
    res.status(200).json(allBooks);
  } catch (err) {
    next(err);
  }
};
exports.bookRoute = async (req, res, next) => {
    try {
      const book = await Books.findOne({ _id: req.params.id });
      res.status(200).json(book);
    } catch (err) {
      next(err);
    }
  };

  exports.categoryRoute = async (req, res, next) => {
    try {
      const sameTypedBooks = await Books.find({ type: req.params.type });
      res.status(200).json(sameTypedBooks);
    } catch (err) {
      next(err);
    }
  };


  exports.createBook = async (req, res, next) => {
    try {
      const newBook = new Books(req.body);
      const saveBook = await newBook.save();
      res.status(200).json({
        message: "Book created Successfully!",
      });
    } catch (err) {
      next(err);
    }
  };

  exports.requestRoute = async (req, res, next) => {
    try {
      const getUser = await User.findOne({ _id: req.body.userId });
  
      const bool = () => {
        let boolean = false;
        getUser?.requestedBooks?.forEach((obj) => {
          if (!boolean) {
            if (obj.bookId === req.body.bookId) {
              boolean = true;
            }
          }
        });
        return boolean;
      };
  
      if (!bool()) {
        const newRequest = new Request(req.body);
        const savedRequest = await newRequest.save();
  
        const detailsToUser = {
          bookId: savedRequest?.bookId,
          bookname: savedRequest?.bookname,
          authorname: savedRequest?.authorname,
          genre: savedRequest?.genre,
          from: savedRequest?.from_date,
          to: savedRequest?.to_date,
          amount: savedRequest?.amount,
        };
  
        const requestedUser = await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { requestedBooks: detailsToUser } }
        );
  
        res.status(200).json({
          status: "Success",
          message: "Request sent to Admin",
        });
      } else {
        res.status(200).json({
          status: "Failure",
          message: "Already Requested!",
        });
      }
    } catch (err) {
      next(err);
    }
  };  
  exports.requestedBooksRoute = async (req, res, next) => {
    try {
      const reqBooks = await Request.find();
      res.status(200).json(reqBooks);
    } catch (err) {
      next(err);
    }
  };

  exports.moveToRentedRoute = async (req, res, next) => {
    try {
      const getReqBook = await Request.findOne({
        userId: req.body.userId,
        bookId: req.body.bookId,
      });
  
      if (getReqBook) {
        const dataToRented = {
          userId: getReqBook.userId,
          bookId: getReqBook.bookId,
          bookname: getReqBook.bookname,
          authorname: getReqBook.authorname,
          genre: getReqBook.genre,
          from_date: getReqBook.from_date,
          to_date: getReqBook.to_date,
          amount: getReqBook.amount,
          returned: false,
        };
  
        const addToRented = new Rented(dataToRented);
        const saveRented = await addToRented.save();
  
        try {
          await Request.findOneAndDelete({
            userId: getReqBook.userId,
            bookId: getReqBook.bookId,
          });
  
          await User.findByIdAndUpdate(
            {
              _id: getReqBook.userId,
            },
            {
              $pull: { requestedBooks: { bookId: getReqBook.bookId } },
              $push: { rentedHistory: saveRented, bookInHand: saveRented },
            }
          );
  
          res.status(200).json({
            message: "Request Accepted!",
          });
        } catch (err) {
          next(err);
        }
      } else {
        const error = new Error("Book not found");
        error.status = 404;
        next(error);
      }
    } catch (err) {
      next(err);
    }
  };

  exports.declineBook=async(req, res, next)=>{
    try{
      const {userId , bookId}= req.body;
      const resp= await Request.findOneAndDelete({
        bookId:bookId,
      });
      res.status(200).json({
        message:"Book Request Declined",
      })

    }
    catch(err){
        next(err)
    }
  }
  
  exports.getAllRentalsRoute = async (req, res, next) => {
    try {
      const rentalBooks = await Rented.find();
      res.status(200).json(rentalBooks);
    } catch (err) {
      next(err);
    }
  };
  
  exports.returnedStatChange = async (req, res, next) => {
    try {
      await User.findByIdAndUpdate(
        { _id: req.body.userId },
        { $pull: { bookInHand: { bookId: req.body.bookId } } }
      );
  
      await Rented.findByIdAndUpdate({ _id: req.body._id }, { returned: true });
  
      res.status(204).send("Updated to DB!");
    } catch (err) {
      next(err);
    }
  };
  
  exports.deleteBook = async(req, res, next)=>{
    try{
      const{bookId}= req.body;
      console.log(bookId);
      const book = await Books.findOneAndDelete({
        _id:bookId,
      })
      return res.status(200).json({
        message:"Book deleted Successfully",
      })
    }
    catch(err){
      next(err);
    }
  }
  exports.updatePrice = async (req, res, next) => {
    try {
      const { bookId, price } = req.body;
      const book = await Books.findByIdAndUpdate(
        bookId, // Specify the id directly, not in an object
        { price: price },
        { new: true } // This ensures that the updated document is returned
      );
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      res.status(200).json({ message: "Amount updated successfully" });
    } catch (err) {
      next(err);
    }
  };  