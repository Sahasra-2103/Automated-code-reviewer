module.exports = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || '',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqBaseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  xaiApiKey: process.env.XAI_API_KEY || process.env.GROK_API_KEY || '',
  xaiBaseUrl: process.env.XAI_BASE_URL || process.env.GROK_BASE_URL || 'https://api.x.ai/v1',
  xaiModel: process.env.XAI_MODEL || 'grok-2',
  aiProvider: process.env.AI_PROVIDER || 'groq',
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
