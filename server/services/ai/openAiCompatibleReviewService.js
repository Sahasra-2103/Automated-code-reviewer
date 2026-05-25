const axios = require('axios');
const promptService = require('./promptService');

const parseResponseJson = (raw) => {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) {
    return null;
  }

  const jsonText = raw.slice(firstBrace, lastBrace + 1);
  try {
    return JSON.parse(jsonText);
  } catch (error) {
    return null;
  }
};

const toChatCompletionsUrl = (url) => {
  const trimmed = String(url || '').replace(/\/$/, '');
  if (trimmed.endsWith('/chat/completions')) {
    return trimmed;
  }
  return `${trimmed}/chat/completions`;
};

exports.createReviewService = ({
  apiKey,
  baseUrl,
  model,
  providerName,
  deprecatedModels = {}
}) => ({
  reviewCode: async (code, language) => {
    if (!apiKey) {
      const error = new Error(`${providerName} API key is not configured in the deployment environment.`);
      error.status = 500;
      throw error;
    }

    const prompt = promptService.buildReviewPrompt(code, language);
    const modelToUse = deprecatedModels[model] || model;

    const payload = {
      model: modelToUse,
      messages: [
        {
          role: 'system',
          content: 'You return precise JSON code reviews. You are calibrated: excellent code can score 9-10, average code scores 6-7, and broken or unsafe code scores below 6.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    };

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await axios.post(toChatCompletionsUrl(baseUrl), payload, { headers, timeout: 30000 });
      const rawOutput = response?.data?.choices?.[0]?.message?.content || '';
      const parsed = parseResponseJson(rawOutput);

      if (parsed) {
        return {
          summary: parsed.summary || 'AI review completed.',
          score: parsed.score || '0',
          issues: parsed.issues || [],
          improvedCode: parsed.improvedCode || '',
          bestPractices: parsed.bestPractices || []
        };
      }

      return {
        summary: rawOutput.slice(0, 1024),
        score: '0',
        issues: [],
        improvedCode: '',
        bestPractices: []
      };
    } catch (error) {
      const status = error.response?.status || 500;
      const errorData = error.response?.data?.error || error.response?.data;
      const message = errorData
        ? String(errorData.message || JSON.stringify(errorData))
        : String(error.message || `${providerName} API request failed`);
      console.error(`${providerName} API Error Detail:`, error.response?.data || error.message);
      const providerError = new Error(`${providerName} provider error (${status}): ${message}`);
      providerError.status = status;
      throw providerError;
    }
  }
});
