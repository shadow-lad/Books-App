const express = require("express");
const exphbs = require("express-handlebars");
const apiRoutes = require("./routes/api");
const booksRoutes = require("./routes/bookRoutes");
const hbs = exphbs.create({
	defaultLayout: "main",
	extname: "hbs",
	helpers: {
		array: function (val) {
			return val.filter((e) => e).join(", ");
		},
		currency: function (val) {
			switch (val) {
				case "USD":
					return "$";
				case "INR":
					return "₹";
				default:
					return "";
			}
		},
		ifEquals: function (val1, val2, options) {
			if (val1 === val2) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		},
		for: function (start, end, inc, options) {
			var accum = "";
			for (let i = +start; i <= +end; i += +inc) {
				accum += options.fn(i);
			}
			return accum;
		},
		/**
		 * @param {Date} date
		 */
		dateFormat: function (date) {
			return date.toLocaleDateString();
		},
		units: function (units) {
			if (/^percent$/i.test(units)) {
				return "%";
			} else {
				return "$";
			}
		},
	},
});

const app = express();

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
if (process.env.NODE_ENV === "development") {
	app.use(require("morgan")("dev"));
}
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiRoutes);
app.use("/books", booksRoutes);

app.get("/", (_req, res) => res.render("home"));

module.exports = app;
