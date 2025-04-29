const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const MONGOURI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const Books = require('./schema');

app.use(express.json());

app.post("/addBooks", async (req, res) => {
    try {
        const { title, author, genre, publishedYear, availableCopies, borrowedBy } = req.body;
        if (!title || !author || !genre || !availableCopies) {
            return res.status(400).send({ msg: "All fields required" });
        }
        const newBook = new Books({ title, author, genre, publishedYear, availableCopies, borrowedBy });
        const createdBooks = await newBook.save();
        res.status(200).send({ msg: "Books added successfully", createdBooks });
    } catch (error) {
        res.status(500).send({ msg: "Internal server error" });
    }
});

app.get('/', async (req, res) => {
    try {
        const BooksData = await Books.find();
        res.status(200).send({ msg: "Here are the books data:", BooksData });
    } catch (error) {
        res.status(500).send({ msg: "Internal server error" });
    }
});

app.put('/update/:title', async (req, res) => {
    try {
        const { author, genre, publishedYear, availableCopies, borrowedBy } = req.body;
        const updatedData = await Books.findOneAndUpdate(
            { title: req.params.title },
            { author, genre, publishedYear, availableCopies, borrowedBy },
            { new: true }
        );
        if (!updatedData) {
            return res.status(404).send({ msg: "Book not found" });
        }
        res.status(200).send({ msg: "Book is updated successfully", updatedData });
    } catch (error) {
        res.status(500).send({ msg: "Internal server error" });
    }
});

app.delete('/delete/:title', async (req, res) => {
    try {
        const book = await Books.findOne({ title: req.params.title });
        if (!book) {
            return res.status(404).send({ msg: "Title not found" });
        }
        const deletedItem = await Books.findOneAndDelete({ title: req.params.title });
        res.status(200).send({ msg: "Item Deleted Successfully", deletedItem });
    } catch (error) {
        res.status(500).send({ msg: "Internal server error" });
    }
});

mongoose.connect(MONGOURI)
    .then(() => { console.log("Mongodb connected successfully"); })
    .catch((err) => { console.log(err); });

app.listen(PORT, () => {
    console.log(`Server connected successfully on ${PORT}`);
});