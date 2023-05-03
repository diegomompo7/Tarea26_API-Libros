const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del usuario
const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
          type: String,
          required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Author", authorSchema);
module.exports = { Book };
