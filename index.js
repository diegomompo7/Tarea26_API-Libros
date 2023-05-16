// Conexión a la BBDD;
const express = require("express");
const { bookRouter } = require("./routes/book.routes.js");
const { authorRouter } = require("./routes/author.routes.js");
const { fileUploadRouter } = require("./routes/file-upload.routes.js");
const cors = require("cors");

const main = async () => {
  const { connect } = require("./db.js");
  const database = await connect();

  // Modelos

  const PORT = 3000;
  const server = express();
  server.use(express.json());
  server.use(express.urlencoded({ extented: false }));
  server.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Rutas
  const router = express.Router();
  router.get("/", (req, res) => {
    console.log(database.connection.name);
    res.send(`Esta es la home de nuestra API. Estamos utilizando la BBDD de ${database.connection.name} `);
    console.log();
  });
  router.get("*", (req, res) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  server.use((req, res, next) => {
    const date = new Date();
    console.log(`Petición de tipo ${req.method} a la url ${req.originalUrl} el ${date}`);
    next();
  });

  server.use("/", router);
  server.use("/books", bookRouter);
  server.use("/authors", authorRouter);
  server.use("/file-upload", fileUploadRouter);

  // Middleware de gestión de errores
  server.use((err, req, res, next) => {
    console.log("*** INICIO DE ERROR ***");
    console.log(`PETICIÓN FALLIDA: ${req.method} a la url ${req.originalUrl}`);
    console.log(err);
    console.log("*** FIN DE ERROR ***");

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else {
      res.status(500).json(err);
    }
  });

  server.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
};
main();
