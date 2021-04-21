require("dotenv").config();
/** @type import("express").Express */
const app = require("./config");
const mongoose = require("mongoose");

const DB_URL = process.env.MONGO_URL;

const PORT = process.env.PORT || 8080;

mongoose.connect(DB_URL, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: true,
}, (err)=> {
	if (err) return console.log("An error occurred while trying to connect to the server", err);
	console.log("DB Connection Successful");
});

app.listen(PORT, () => {
	console.log("Server started on PORT", PORT);
	console.log(`You can access the server on http://localhost:${PORT}`);
});
