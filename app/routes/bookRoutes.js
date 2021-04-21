const router = require("express").Router();
const { getBooksTable } = require("../controllers/booksController");

router.get("/", getBooksTable);

module.exports = router;
