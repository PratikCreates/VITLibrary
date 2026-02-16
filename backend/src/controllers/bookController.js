const { prisma } = require('../prisma/client');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await prisma.book.findMany();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books" });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await prisma.book.findUnique({
            where: { id: req.params.id }
        });
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch book" });
    }
};

exports.addBook = async (req, res) => {
    try {
        const { title, author, genre, description, total_copies } = req.body;
        const book = await prisma.book.create({
            data: {
                title,
                author,
                genre,
                description,
                total_copies,
                available_copies: total_copies
            }
        });
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ error: "Failed to add book" });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { title, author, genre, description, total_copies, available_copies } = req.body;
        const book = await prisma.book.update({
            where: { id: req.params.id },
            data: {
                title,
                author,
                genre,
                description,
                total_copies,
                available_copies
            }
        });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: "Failed to update book" });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        await prisma.book.delete({
            where: { id: req.params.id }
        });
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete book" });
    }
};
