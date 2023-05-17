const express = require("express");
const bcrypt = require("bcrypt")
const { Author } = require("../model/Author.js");
const { isAuth } = require("../middlewares/auth.middleware.js");
const { generateToken } = require("../utils/token");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "public" });
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("Estamos en el middlware / car que comprueba parámetros");
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
    req.query.page = page;
    req.query.limit = limit;
    next()
  } else {
    console.log("Parámetros no válidos")
    console.log(JSON.stringify(req.query))
    res.status(400).json({ error: "Params page or limit are not valid" })
  }
})

router.get("/", async (req, res) => {
  try {
    const { page, limit } = req.query
    const authors = await Author.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Author.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPage: Math.ceil(totalElements / limit),
      currentPage: page,
      date: authors,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    const author = await Author.find({ title: new RegExp("^" + title.toLowerCase(), "i") });
    if (author) {
      res.json(author);
    } else {
      res.status(404).json();
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  Author.findById(id)
    .then((author) => {
      if (author) {
        res.json(author);
      } else {
        res.status(404).json({});
      }
    })
    .catch((error) => res.status(500).json(error));
});

router.post("/", async (req, res) => {
  try {
    const author = new Author(req.body);
    const createdAuthor = await author.save();
    return res.status(201).json(createdAuthor);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", isAuth, async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.id !== id || req.user.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "1No tienes autorización para realizar esta operación" });
    }

    const authorDeleted = await Author.findByIdAndDelete(id);
    if (authorDeleted) {
      res.json(authorDeleted);
    } else {
      res.status(404).json();
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
router.put("/:id", isAuth, async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.id !== id || req.user.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" })
    }

    const authorUpdated = await Author.findById(id);
    if (authorUpdated) {
      Object.assign(authorUpdated, req.body)
      await authorUpdated.save()
      const authorToSend = authorUpdated.toObject()
      delete authorToSend.password
      res.json(authorToSend);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/logo-upload", upload.single("logo"), async (req, res, next) => {
  try {
    // Renombrado de la imagen
    const originalname = req.file.originalname;
    const path = req.file.path;
    const newPath = path + "_" + originalname;
    fs.renameSync(path, newPath);

    // Busqueda de la marca
    const authorId = req.body.authorId;
    const author = await Author.findById(authorId);

    if (author) {
      author.logoImage = newPath;
      await author.save();
      res.json(author);

      console.log("Marca modificada correctamente!");
    } else {
      fs.unlinkSync(newPath);
      res.status(404).send("Marca no encontrada");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se deben especificar los campos email y password" });
    }

    const author = await Author.findOne({ email }).select("+password");
    if (!author) {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }

    const match = await bcrypt.compare(password, author.password);
    if (match) {
      // Quitamos password de la respuesta
      const authorWithoutPass = author.toObject();
      delete authorWithoutPass.password;

      const jwtToken = generateToken(author._id, author.email);

      return res.status(200).json({ token: jwtToken });
    } else {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { authorRouter: router };
