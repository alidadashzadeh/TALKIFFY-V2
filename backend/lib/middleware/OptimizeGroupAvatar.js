import sharp from "sharp";

export const optimizeGroupAvatar = async (req, res, next) => {
	try {
		if (!req.file) return next();

		const optimizedBuffer = await sharp(req.file.buffer)
			.resize(500, 500, { fit: "cover" })
			.webp({ quality: 60 })
			.toBuffer();

		req.file.buffer = optimizedBuffer;

		next();
	} catch (error) {
		next(error);
	}
};
