const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Book } = require("../model/Book.js");
const { faker } = require("@faker-js/faker");

const bookList = [
  {
    title: "Harry Potter",
    author: "J.K. Rowling",
    pages: 543,
    publisher: { name: "Penguin Random House", country: "United States" }
  },
  {
    title: "1984",
    author: "George Orwell",
    pages: 328,
    publisher: { name: "Bloomsbury", country: "United Kingdom" }
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    pages: 281,
    publisher: { name: "Gallimard", country: "France" }
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    pages: 180,
    publisher: { name: "Shueisha", country: "Japan" }
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
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
    author: faker.name.fullName(),
    pages: faker.datatype.number({ min: 100, max: 500 }),
  };
  bookList.push(newBook);
}

const bookSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");

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
