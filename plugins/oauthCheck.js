const { configs } = require("../configs");
const { sendErrorResponse } = require("../utils/responseHelpers");

const oauthCheck = async (request, reply) => {
	const { provider } = request.params;

	// Function to send the error message if the oauth provider is
	// not configured in the server
	const sendOauthProviderError = () => {
		return sendErrorResponse(
			reply,
			404,
			`Please configure ${provider} configs in server.Provider configuration not found.`
		);
	};

	switch (provider) {
		case configs.PROVIDER_GITHUB:
			if (!configs.GITHUB_CONFIGS.CONFIGURED) sendOauthProviderError();
			break;
		case configs.PROVIDER_GOOGLE:
			if (!configs.GOOGLE_CONFIGS.CONFIGURED) sendOauthProviderError();
			break;
		default:
			return sendErrorResponse(
				reply,
				404,
				`Route ${request.method}:${request.url} not found`
			);
	}
	request.provider = provider;
};

module.exports = oauthCheck;
