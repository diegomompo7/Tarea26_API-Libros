const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del usuario
const userSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      required: false,
    },
    publisher: {
      type: {
        name: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", userSchema);
module.exports = { Book };
