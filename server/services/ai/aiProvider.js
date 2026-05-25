const grokService = require('./grokService');

const providers = {
  grok: grokService
};

exports.reviewCode = async (code, language) => {
  const provider = providers[process.env.AI_PROVIDER || 'grok'];
  if (!provider) {
    throw new Error('AI provider is not configured');
  }
  return provider.reviewCode(code, language);
};
