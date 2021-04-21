const { getBooks, extractQuery } = require("../utils/booksUtil");

/**
 * @param {import("express").RequestHandler} req
 * @param {import("express").Response} res
 */
exports.getBooksJSON = async (req, res) => {
	try {
		const queries = extractQuery(req);
		const books = await getBooks(
			queries.sort,
			+queries.page,
			+queries.limit,
			queries.search,
			queries.order
		);
		res.json({
			status: "success",
			data: books,
		});
	} catch (error) {
		res.status(404).json({
			status: "fail",
			message: error.message,
		});
	}
};

/**
 * @param {import("express").RequestHandler} req
 * @param {import("express").Response} res
 */
exports.getBooksTable = async (req, res) => {
	try {
		const queries = extractQuery(req);
		const page = +queries.page || 1;
		const books = await getBooks(
			queries.sort,
			page,
			+queries.limit,
			queries.search,
			queries.order
		);

		let first = page - 2;
		let last = page + 2;

		if (first < 1) {
			first = 1;
			last = Math.min(5, books.totalPages);
		}

		if (last > books.totalPages) {
			last = books.totalPages;
			first = Math.max(last - 4, 1);
		}

		res.render("booksTable", {
			...books,
			sort: queries.sort || "title",
			page,
			searchTerm: {
				url: encodeURIComponent(queries.searchTerm),
				text: queries.searchTerm,
			},
			first,
			last,
			order: queries.order || (queries.order === 0 ? 0 : 1),
			prev: page === 1 ? null : page - 1,
			next: page === books.totalPages ? null : page + 1,
			limit: +queries.limit || 10,
		});
	} catch (err) {
		let error = err;
		if (error.errors) {
			error = error.errors;
		}
		res.status(404).render("error", { error });
	}
};
