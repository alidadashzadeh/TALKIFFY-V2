import sharp from "sharp";

export const optimizeMessageImage = async (req, res, next) => {
	try {
		if (!req.file) return next();

		if (!req.file.mimetype.startsWith("image/")) {
			return next();
		}

		const optimizedBuffer = await sharp(req.file.buffer)
			.rotate()
			.resize({
				width: 1280,
				withoutEnlargement: true,
			})
			.webp({ quality: 80 })
			.toBuffer();

		req.file.buffer = optimizedBuffer;
		req.file.mimetype = "image/webp";
		req.file.originalname = req.file.originalname.replace(/\.[^.]+$/, ".webp");
		req.file.size = optimizedBuffer.length;

		next();
	} catch (error) {
		next(error);
	}
};
