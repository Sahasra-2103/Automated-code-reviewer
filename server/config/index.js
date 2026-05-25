module.exports = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || '',
  grokApiKey: process.env.GROK_API_KEY || '',
  grokModel: process.env.GROK_MODEL || 'grok-4',
  aiProvider: process.env.AI_PROVIDER || 'grok',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
