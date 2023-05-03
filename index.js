// Conexión a la BBDD;
const express = require("express")
const { bookRouter } = require("./routes/book.routes.js")

const { connect } = require("./db.js");
connect();

// Modelos
const { Book } = require("./model/Book.js");

const PORT = 3000
const server = express()
server.use(express.json())
server.use(express.urlencoded({ extented : false }))

//Rutas
const router = express.Router()
router.get("/", (req, res) => {
    res.send("Esta es la home de nuestra API de libros");
    console.log()
  });
router.get("*", (req, res) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
});

server.use("/", router)
server.use("/books", bookRouter)

server.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`)
})