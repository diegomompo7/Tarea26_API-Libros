const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allowedCountries = ["COLOMBIA", "ENGLAND", "RUSSIA", "UNITED STATES", "ARGENTINA", "CZECHOSLOVAKIA", "JAPAN", "NIGERIA"];

// Creamos el schema del usuario
const authorSchema = new Schema(
  {
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
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Author", authorSchema);
module.exports = { Book };
