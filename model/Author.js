const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const allowedCountries = ["ESPAÑA"];

// Creamos el schema del usuario
const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "El nombre debe tener mínimo 3 caracteres"],
      maxLength: [100, "El nombre debe ser inferior a 20 caracteres"],
      trim: true,
    },
    country: {
      type: String,
      required: true,
      enum: allowedCountries,
      uppercase: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email incorrecto",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false,
    },
    profileImage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

authorSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Author = mongoose.model("Author", authorSchema, "authors");
module.exports = { Author };
