const grokService = require('./grokService');
const xaiService = require('./xaiService');
const { aiProvider, groqApiKey, xaiApiKey } = require('../../config');

const providers = {
  groq: grokService,
  grok: xaiService,
  xai: xaiService
};

const resolveProviderKey = () => {
  if (aiProvider) return aiProvider;
  if (xaiApiKey) return 'xai';
  if (groqApiKey) return 'groq';
  return 'groq';
};

exports.reviewCode = async (code, language) => {
  const provider = providers[resolveProviderKey()];
  if (!provider) {
    throw new Error('AI provider is not configured');
  }
  return provider.reviewCode(code, language);
};
