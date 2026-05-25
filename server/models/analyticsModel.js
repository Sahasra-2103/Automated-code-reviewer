const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  totalReviews: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  issueDistribution: {
    High: { type: Number, default: 0 },
    Medium: { type: Number, default: 0 },
    Low: { type: Number, default: 0 }
  },
  languageUsage: {
    JavaScript: { type: Number, default: 0 },
    TypeScript: { type: Number, default: 0 },
    Python: { type: Number, default: 0 },
    Java: { type: Number, default: 0 },
    C: { type: Number, default: 0 },
    'C++': { type: Number, default: 0 },
    Go: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
