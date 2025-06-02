const express = require("express");
const connectToDb = require("./db/connectToDb");
const { default: mongoose, isValidObjectId } = require("mongoose");
const bookModels = require("./models/book.models");
const app = express();

app.use(express.json());
connectToDb();
app.get("/api/books/top-5", async (req, res) => {
  const books = await bookModels.find();
  const sortedBooks = books
    .sort((a, b) => b.readCount - a.readCount)
    .splice(0, 5);
  res.json(sortedBooks);
});

app.get("/api/books", async (req, res) => {
  const books = await bookModels.find();
  const query = req.query;
  if (query.type === "read") {
    console.log("object");
    const books1 = books.filter((el) => el.isRead === true);
    res.json(books1);
  }
  if (query.type === "unread") {
    const books2 = books.filter((el) => el.isRead === false);
    res.json(books2);
  }

  res.json(books);
});

app.get("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "invalid id" });
  }
  const boook = await bookModels.findById(id);
  if (!boook) {
    res.status(400).json({ error: "book not found" });
  }

  res.json({ message: "read succsesfully", data: boook });
});

app.post("/api/books", async (req, res) => {
  const { title, author, isRead, notes, readCount } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: "required" });
  }
  const createdBook = await bookModels.create({
    title,
    author,
    isRead,
    readCount,
    notes,
  });
  res.status(201).json({ message: "creted succsesfully", data: createdBook });
});

app.post("/api/books/:id/add-node", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "invalid id" });
  }

  const { note } = req.body;
  if (!note) {
    res.status(400).json({ error: "note is required" });
  }
  const updatedNOte = await bookModels.findByIdAndUpdate(
    id,
    { $push: { notes: note } },
    { new: true }
  );
  res
    .status(201)
    .json({ message: "note added succsesfully", data: updatedNOte });
});

app.delete("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "invalid id" });
  }
  const deletedBook = await bookModels.findByIdAndDelete(id);
  if (!deletedBook) {
    res.status(400).json({ error: "book obnt found" });
  }
  res.json({ message: "delted succsesfully", data: deletedBook });
});

app.put("/api/books/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ error: "invalid id" });
  }
  const book = await bookModels.findById(id);
  console.log(book);
  const { title, author, isRead, readCount, notes } = req.body;

  let updatedReadCount = book.readCount;

  if (book.isRead === false && isRead === "true") {
    updatedReadCount = updatedReadCount + 1;
    console.log("object");
  }
  const updatedBook = await bookModels.findByIdAndUpdate(
    id,
    { title, author, isRead, readCount: updatedReadCount, notes },
    { new: true }
  );
  console.log(updatedBook);
  if (!updatedBook) {
    res.status(400).json({ error: "book obnt found" });
  }

  //   if (isRead) {
  //     console.log(updatedBook.readCount)
  //     updatedBook.readCount += 1
  //   }

  res.json({ message: "updated succsesfully", data: updatedBook });
});

app.listen(4000, () => {
  console.log("server is running on http://localhost:4000");
});
