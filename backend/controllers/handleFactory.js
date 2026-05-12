import ApiFeature from "../lib/ApiFeatures.js";

export const getAll = (Model) => {
	return async (req, res, next) => {
		try {
			const features = new ApiFeature(Model.find(), req.query)
				.filter()
				.sort()
				.limitFields();

			const doc = await features.query;

			res.status(200).json({
				status: "success",
				results: doc.length,
				data: {
					doc,
				},
			});
		} catch (error) {
			res.status(400).json({ status: "fail", message: error.message });
		}
	};
};

export const getOne = (Model, popOptions) => {
	return async (req, res, next) => {
		try {
			let query = Model.findById(req.params.id);
			if (popOptions) query = query.populate(popOptions);

			const doc = await query;

			if (!doc) throw new Error("There is no data with provided ID ");

			res.status(200).json({
				status: "success",
				data: { doc },
			});
		} catch (error) {
			res.status(400).json({ status: "fail", message: error.message });
		}
	};
};

export const createOne = (Model) => {
	return async (req, res, next) => {
		try {
			const doc = await Model.create(req.body);

			res.status(201).json({
				status: "success",
				data: {
					doc,
				},
			});
		} catch (error) {
			res.status(400).json({ status: "fail", message: error.message });
		}
	};
};

export const updateOne = (Model) => {
	return async (req, res, next) => {
		if (req.file) {
			req.body.avatar = req.file.filename;
		}

		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc) throw new Error("There is no data with provided ID ");

		res.status(200).json({ status: "success", data: { doc } });

		try {
		} catch (error) {
			res.status(400).json({ status: "fail", message: error.message });
		}
	};
};

export const deleteOne = (Model) => {
	return async (req, res, next) => {
		try {
			await Model.findByIdAndDelete(req.params.id);

			res.status(204).json({
				status: "success",
				data: null,
			});
		} catch (error) {
			res.status(400).json({ status: "fail", message: error.message });
		}
	};
};
