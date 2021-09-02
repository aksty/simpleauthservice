const { configs } = require("../configs");
const { sendErrorResponse } = require("../handlers/responseHelpers");

const getErrorHandler = (fastify) => {
	return function (err, request, reply) {
		fastify.log.error(err);

		//Default Status code and error message
		let statusCode = 500;
		let message = "Error in the server";

		//Send messages as response in development environment
		if (configs.ENVIRONMENT === "dev") {
			message = err.message;
		}

		//Fastify Schema validation errors
		if (err.validation) {
			message = err.message;
			statusCode = 400;
		}

		switch (err.name) {
			case "CastError":
				message = `Resource not found`;
				statusCode = 404;
				break;
			case "TokenExpiredError":
				message = "Session expired";
				statusCode = 403;
				break;
			case "JsonWebTokenError":
				message = "Token Error";
				statusCode = 403;
				break;
			case "ValidationError":
				// Mongoose validation error
				message = Object.values(err.errors).map((val) => val.message);
				statusCode = 400;
				break;
		}

		// MONGODB : unique key violation
		if (err.code === 11000) {
			message = "Duplicate field value entered";
			statusCode = 400;
		}

		sendErrorResponse(reply, statusCode, message);
	};
};

module.exports = {
	getErrorHandler,
};
