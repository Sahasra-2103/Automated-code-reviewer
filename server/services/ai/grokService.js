const axios = require('axios');
const { grokApiKey, grokModel } = require('../../config');
const promptService = require('./promptService');

const GROK_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

exports.reviewCode = async (code, language) => {
  const prompt = promptService.buildReviewPrompt(code, language);
  
  // If the server hasn't been restarted, process.env.GROK_MODEL might still be an old model
  const deprecatedModels = ['grok-4', 'llama3-70b-8192'];
  const modelToUse = deprecatedModels.includes(grokModel) ? 'llama-3.3-70b-versatile' : grokModel;

  const payload = {
    model: modelToUse,
    messages: [
      {
        role: "system",
        content: "You return precise JSON code reviews. You are calibrated: excellent code can score 9-10, average code scores 6-7, and broken or unsafe code scores below 6."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' }
  };

  const headers = {
    Authorization: `Bearer ${grokApiKey}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(GROK_BASE_URL, payload, { headers, timeout: 30000 });
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
    const errorData = error.response?.data?.error;
    const message = errorData ? (errorData.message || JSON.stringify(errorData)) : (error.message || 'Groq API request failed');
    console.error('Groq API Error Detail:', error.response?.data || error.message);
    throw new Error(`AI provider error: ${message}`);
  }
};
