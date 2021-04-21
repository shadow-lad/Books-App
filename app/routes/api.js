const router = require("express").Router();
const { getBooksJSON } = require("../controllers/booksController");

router.get("/books", getBooksJSON);

module.exports = router;
