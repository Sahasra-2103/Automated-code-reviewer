const { groqApiKey, groqBaseUrl, groqModel } = require('../../config');
const { createReviewService } = require('./openAiCompatibleReviewService');

module.exports = createReviewService({
  apiKey: groqApiKey,
  baseUrl: groqBaseUrl,
  model: groqModel,
  providerName: 'Groq',
  deprecatedModels: {
    'grok-4': 'llama-3.3-70b-versatile',
    'llama3-70b-8192': 'llama-3.3-70b-versatile'
  }
});
