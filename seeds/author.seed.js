const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Author } = require("../model/Author.js");
const { faker } = require("@faker-js/faker");

const authorList = [
  { name: "Gabriel García Márquez", country: "Colombia" },
  { name: "Jane Austen", country: "England" },
  { name: "Leo Tolstoy", country: "Russia" },
  { name: "Virginia Woolf", country: "England" },
  { name: "Ernest Hemingway", country: "United States" },
  { name: "Jorge Luis Borges", country: "Argentina" },
  { name: "Franz Kafka", country: "Czechoslovakia" },
  { name: "Toni Morrison", country: "United States" },
  { name: "Haruki Murakami", country: "Japan" },
  { name: "Chinua Achebe", country: "Nigeria" },
];

for (let i = 0; i < 50; i++) {
  const newAuthor = {
    title: faker.lorem.words(),
    author: faker.name.fullName(),
    pages: faker.datatype.number({ min: 100, max: 500 }),
  };
  authorList.push(newAuthor);
}

const authorSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await Author.collection.drop();
    console.log("Usuarios eliminados");

    // Añadimos usuarios
    const documents = authorList.map((author) => new Author(author));
    await Author.insertMany(documents);

    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

console.log("ANTES");
authorSeed(); // ESPERO VER: "Tenemos conexión", "Coches eliminados" y "Datos guardados correctamente!"
console.log("DESPUÉS");
