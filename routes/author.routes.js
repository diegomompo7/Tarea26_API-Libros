const express = require("express");
const { Author } = require("../model/Author.js");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.Page);
    const limit = parseInt(req.query.limit);
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
    const user = new User(req.body);
    const createdAuthor = await author.save();
    return res.status(201).json(createdAuthor);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const authorDeleted = await User.findByIdAndDelete(id);
    if (authorDeleted) {
      res.json(authorDeleted);
    } else {
      res.status(404).json();
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const authorUpdated = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (authorUpdated) {
      res.json(authorUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = { authorRouter: router };