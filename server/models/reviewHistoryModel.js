const mongoose = require('mongoose');

const reviewHistorySchema = new mongoose.Schema({
  language: { type: String, required: true },
  originalCode: { type: String, required: true },
  reviewSummary: { type: String, required: true },
  score: { type: Number, required: true },
  issues: [
    {
      severity: { type: String, required: true },
      category: { type: String, default: 'Maintainability' },
      line: { type: String, required: true },
      problem: { type: String, required: true },
      impact: { type: String, default: '' },
      solution: { type: String, required: true }
    }
  ],
  improvedCode: { type: String, default: '' },
  bestPractices: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReviewHistory', reviewHistorySchema);
