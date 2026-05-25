const ReviewHistory = require('../models/reviewHistoryModel');
const aiProvider = require('./ai/aiProvider');

const clampScore = (score) => {
  const parsed = Number.parseFloat(score);
  if (!Number.isFinite(parsed)) return 0;

  const normalized = parsed > 10 ? parsed / 10 : parsed;
  return Number(Math.min(Math.max(normalized, 0), 10).toFixed(1));
};

const normalizeSeverity = (severity) => {
  const value = String(severity || '').toLowerCase();
  if (value === 'high') return 'High';
  if (value === 'medium') return 'Medium';
  return 'Low';
};

const normalizeIssues = (issues = []) => {
  if (!Array.isArray(issues)) return [];

  return issues
    .filter((issue) => issue && (issue.problem || issue.solution))
    .map((issue) => ({
      severity: normalizeSeverity(issue.severity),
      category: String(issue.category || 'Maintainability').trim(),
      line: String(issue.line || 'N/A').trim(),
      problem: String(issue.problem || 'Issue detected in the submitted code.').trim(),
      impact: String(issue.impact || '').trim(),
      solution: String(issue.solution || 'Review and correct this section.').trim()
    }));
};

exports.createReview = async (code, language) => {
  const aiResponse = await aiProvider.reviewCode(code, language);
  const score = clampScore(aiResponse.score);

  const reviewRecord = await ReviewHistory.create({
    language,
    originalCode: code,
    reviewSummary: aiResponse.summary,
    score,
    issues: normalizeIssues(aiResponse.issues),
    improvedCode: aiResponse.improvedCode || '',
    bestPractices: aiResponse.bestPractices || []
  });

  return reviewRecord;
};

exports.listReviews = async () => {
  return ReviewHistory.find().sort({ createdAt: -1 }).lean();
};

exports.deleteReview = async (id) => {
  return ReviewHistory.findByIdAndDelete(id);
};
