const { configs } = require("../../configs");
const {
	getSuccessObject,
	responseErrors,
	getEmailStatusResponse,
} = require("./common");

const oauthSchema = {
	getOauthProviderLogin: {
		description: "URL to get provider login url",
		tags: ["Oauth Provider Login"],
		params: {
			type: "object",
			properties: {
				provider: {
					type: "string",
					description: "Oauth Provider",
				},
			},
		},
		querystring: {
			type: "object",
			properties: {
				state: { type: "string" },
			},
		},
		response: {
			200: getSuccessObject(200, true, "Successful Sign in", {
				loginUrl: { type: "string" },
				state: { type: "string" },
			}),

			400: responseErrors[400],
			500: responseErrors[500],
		},
	},
	postOauthProviderLogin: {
		description:
			"Sign in using Oauth2 provider (callback URL handlers\
            redirection to frontend). Sets Refresh token in cookie.\
			(Sent in response if config - REFRESH_RESPONSE is enabled)",
		tags: ["Oauth Provider Login"],
		params: {
			type: "object",
			properties: {
				provider: {
					type: "string",
					description: "Oauth Provider",
				},
			},
		},
		body: {
			type: "object",
			properties: {
				code: {
					type: "string",
					example: "asdfihasikdfjhisfuhkjdfn",
				},
			},
			required: ["code"],
		},
		response: {
			200: getSuccessObject(200, true, "Successful Sign in", {
				token: { type: "string" },
				verifyToken: { type: "string" },
				...getEmailStatusResponse(),
			}),
			201: getSuccessObject(201, true, "Account successfully created", {
				token: { type: "string" },
				verifyToken: { type: "string" },
				...getEmailStatusResponse(),
			}),
			400: responseErrors[400],
			500: responseErrors[500],
			404: responseErrors[404],
		},
	},
};

module.exports = {
	oauthSchema,
};
