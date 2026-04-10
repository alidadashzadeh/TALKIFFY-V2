import AppError from "../AppError.js";

const handleCastErrorDB = (err) => {
	return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const field = Object.keys(err.keyValue || {})[0];
	const value = err.keyValue?.[field];

	return new AppError(`${field} "${value}" already exists.`, 400);
};

const handleValidationErrorDB = (err) => {
	const messages = Object.values(err.errors).map((el) => el.message);
	return new AppError(messages.join(", "), 400);
};

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		return res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	}

	console.error("UNEXPECTED ERROR:", err);

	return res.status(500).json({
		status: "error",
		message: "Something went wrong.",
	});
};

const globalErrorHandler = (err, req, res, next) => {
	let error = err;

	error.statusCode = error.statusCode || 500;
	error.status = error.status || "error";

	if (err.name === "CastError") {
		error = handleCastErrorDB(err);
	}

	if (err.code === 11000) {
		error = handleDuplicateFieldsDB(err);
	}

	if (err.name === "ValidationError") {
		error = handleValidationErrorDB(err);
	}

	if (process.env.NODE_ENV === "development") {
		return sendErrorDev(error, res);
	}

	return sendErrorProd(error, res);
};

export default globalErrorHandler;
