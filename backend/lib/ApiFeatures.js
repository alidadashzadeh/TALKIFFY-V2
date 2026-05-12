class ApiFeature {
	constructor(query, queryObject) {
		this.query = query;
		// this.query = User.find()
		this.queryObject = queryObject;
		// this.queryObject = {email:'test@example.com}
	}

	filter() {
		// 1. filtering
		const queryObj = { ...this.queryObject };
		const excludedFields = ["sort", "fields", "page", "limit"];
		excludedFields.forEach((el) => delete queryObj[el]);

		// 2. advanced filtering
		let queryString = JSON.stringify(queryObj);
		queryString = queryString.replace(
			/\b(gte|gt|lte|lt|all)\b/g,
			(match) => `$${match}`,
		);

		this.query = this.query.find(JSON.parse(queryString));

		return this;
		// {query:User.find().find(),quryObject:{email:test@example.com}}
	}

	sort() {
		if (this.queryObject.sort) {
			const sortBy = this.queryObject.sort.split(",").join(" ");
			this.query = this.query.sort(sortBy);
		}

		return this;
		// {query:User.find().find().sort(),quryObject:{email:test@example.com}}
	}

	limitFields() {
		if (this.queryObject.fields) {
			const fields = this.queryObject.fields.split(",").join(" ");
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select("-__v");
		}
		return this;
		// {query:User.find().find().sort().select(),quryObject:{email:test@example.com}}
	}
}

export default ApiFeature;
