const mongoose = require("mongoose");
const { escapeRegex } = require("./common");

const collectionName = process.env.MONGO_COLLECTION

/**
 *
 * @param {String} name
 * @returns {Promise<mongoose.Collection>}
 */
const getCollection = (name) => {
	return new Promise((resolve, reject) => {
		mongoose.connection.db.collection(name, (err, collection) => {
			if (err) return reject(err);
			resolve(collection);
		});
	});
};

/**
 * @param {import("express").RequestHandler} req
 */
exports.extractQuery = (req) => {
	const queries = req.query;
	const searchTerm = queries.search || "";
	return {
		sort: queries.sort,
		searchTerm,
		page: queries.page,
		limit: queries.limit,
		search: {
			title: new RegExp(`.*${escapeRegex(searchTerm)}.*`, "ig"),
		},
		order: queries.order === "desc" ? 0 : 1,
	};
};

exports.getBooks = async (sort, page, limit, search, order) => {
	sort = sort ? { [sort]: order || -1 } : { title: order || -1 };
	page = page || 1;
	limit = limit || 10;
	search = search || {};

	const Books = await getCollection(collectionName);

	const skip = (page - 1) * limit;
	const books = await Books.find(search)
		.sort(sort)
		.skip(skip)
		.limit(limit)
		.toArray();

	const totalBooks = await Books.find(search).count();
	const totalPages = Math.ceil(totalBooks / limit);
	if (totalPages && page > totalPages) {
		throw new Error("The page you are looking for does not exist");
	}

	return { books, size: books.length, totalPages, currentPage: page };
};
