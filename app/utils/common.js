exports.escapeRegex = (string) =>
	string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
