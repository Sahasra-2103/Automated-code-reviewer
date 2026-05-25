const { xaiApiKey, xaiBaseUrl, xaiModel } = require('../../config');
const { createReviewService } = require('./openAiCompatibleReviewService');

module.exports = createReviewService({
  apiKey: xaiApiKey,
  baseUrl: xaiBaseUrl,
  model: xaiModel,
  providerName: 'Grok'
});
