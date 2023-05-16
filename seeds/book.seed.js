const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Book } = require("../model/Book.js");
const { faker } = require("@faker-js/faker");

const bookList = [
  {
    title: "Harry Potter",
    pages: 543,
    publisher: { name: "Penguin Random House", country: "United States" }
  },
  {
    title: "1984",
    pages: 328,
    publisher: { name: "Bloomsbury", country: "United Kingdom" }
  },
  {
    title: "To Kill a Mockingbird",
    pages: 281,
    publisher: { name: "Gallimard", country: "France" }
  },
  {
    title: "The Great Gatsby",
    pages: 180,
    publisher: { name: "Shueisha", country: "Japan" }
  },
  {
    title: "Pride and Prejudice",
    pages: 279,
    publisher: {
      name: "Altaya",
      country: "Spain",
    },
  },
];

for (let i = 0; i < 50; i++) {
  const newBook = {
    title: faker.lorem.words(),
    pages: faker.datatype.number({ min: 100, max: 500 }),
  };
  bookList.push(newBook);
}

const bookSeed = async () => {
  try {
    const database = await connect();
    console.log("Tenemos conexión");

    console.log(database.connection.name)

    // Borrar datos
    await Book.collection.drop();
    console.log("Usuarios eliminados");

    // Añadimos usuarios
    const documents = bookList.map((book) => new Book(book));
    await Book.insertMany(documents);

    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

console.log("ANTES");
bookSeed(); // ESPERO VER: "Tenemos conexión", "Coches eliminados" y "Datos guardados correctamente!"
console.log("DESPUÉS");
