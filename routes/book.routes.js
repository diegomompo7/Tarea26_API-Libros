const express = require("express")
const { Book } = require("../model/Book.js");
const router = express.Router()


router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.Page)
        const limit = parseInt(req.query.limit)
        const books = await Book.find()
            .limit(limit)
            .skip((page - 1) * limit);
    
    
        const totalElements = await Book.countDocuments()
         
        const response = {
            totalItems: totalElements,
            totalPage: Math.ceil(totalElements / limit),
            currentPage: page,
            date: books,
        }
        res.json(response);
      } catch (error) {
        res.status(500).json(error);
      }
    });

router.get("/title/:title", async(req, res) => {
    const title = req.params.title
    try{
        const book = await Book.find({ title: new RegExp("^" + title.toLowerCase(), "i") })
        if(book) {
            res.json(book)
        } else {
            res.status(404).json()
        }

    }catch (error) {
        res.status(500).json(error)
    }
})

router.get("/:id", (req, res) => {
    const id = req.params.id

    Book.findById(id)
        .then((book) => {
            if(book){
                res.json(book)
            }else{
                res.status(404).json({})
            }
        })
        .catch((error) => res.status(500).json(error))
})


router.post("/", async(req, res) => {
    try{
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            pages: req.body.pages
        })
    const createdBook = await book.save()
    return res.status(201).json(createdBook)
    } catch(error) {
        res.status(500).json(error)
    }
})

router.delete("/:id", async (req, res) => {
    try{
        const id = req.params.id
        const bookDeleted = await User.findByIdAndDelete(id)
        if(bookDeleted){
            res.json(bookDeleted)
        }else{
            res.status(404).json()
        }
    }catch (error){
        res.status(500).json(error)
    }
})
router.put("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const bookUpdated = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (bookUpdated) {
        res.json(bookUpdated);
      } else {
        res.status(404).json({});
      }
    } catch (error) {
      res.status(500).json(error);
    }
})

module.exports = { bookRouter: router };