const express = require("express");
const cors = require("cors");
const crypto = require("node:crypto");
const books = require("./books.json");
const { validateBook, validatePartialBook } = require("./schemas/books");

const PORT = process.env.PORT || 1234;
const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:1234",
        "http://localhost:8080",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

// 📌 Get all Books or get book by genre
app.get("/books", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredBooks = books.filter((book) =>
      book.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    if (filteredBooks.length !== 0) return res.json(filteredBooks);
    res.status(404).json({ message: "Books not found!" });
  }

  res.json(books);
});

// 📌 Get a Book by id
app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((book) => book.id === id);
  if (!book) return res.status(404).json({ message: "Book not found!" });
  res.json(book);
});

// 📌 Create a new Book
app.post("/books", (req, res) => {
  const result = validateBook(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  const newBook = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// 📌 Update a Book by id
app.patch("/books/:id", (req, res) => {
  const result = validatePartialBook(req.body);

  if (result.error) {
    return res.status(422).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found!" });
  }

  const updateBook = {
    ...books[bookIndex],
    ...result.data,
  };

  books[bookIndex] = updateBook;

  return res.json(updateBook);
});

// 📌 Delete a Book by id
app.delete("/books/:id", (req, res) => {
  const origin = req.header("origin");

  if (ORIGINS_ACCEPTED.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  const { id } = req.params;
  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  books.splice(bookIndex, 1);

  res.json({ message: "Book deleted successful!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
