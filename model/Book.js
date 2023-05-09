const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allowedCountries = ["UNITED STATES", "UNITED KINGDOM", "FRANCE", "JAPAN", "SPAIN"];

// Creamos el schema del usuario
const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "El nombre debe tener mínimo 3 caracteres"],
      maxLength: [20, "El nombre defe ser inferior a 20 caracteres"],
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: false,
    },
    pages: {
      type: Number,
      required: false,
      min: 1,
      max: [10000, "Los libros tienen que ser menos de 10000 páginas, si no nadie los lee"],
    },
    publisher: {
      type: {
        name: {
          type: String,
          required: true,
          minLength: [3, "El nombre debe tener mínimo 3 caracteres"],
          maxLength: [20, "El nombre defe ser inferior a 20 caracteres"],
          trim: true
        },
        country: {
          type: String,
          required: true,
          enum: allowedCountries,
          uppercase: true,
          trim: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = { Book };
