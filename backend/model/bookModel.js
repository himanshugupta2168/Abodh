const mongoose = require('mongoose');
const bookSchema = mongoose.Schema({
  bookname: {
    type: String,
    required: true,
  },
  authorname: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  bookImage: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Books = mongoose.model("books", bookSchema);
module.exports= Books;
