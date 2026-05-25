const Analytics = require('../models/analyticsModel');

const defaultDocument = () => ({
  totalReviews: 0,
  averageScore: 0,
  issueDistribution: { High: 0, Medium: 0, Low: 0 },
  languageUsage: { JavaScript: 0, TypeScript: 0, Python: 0, Java: 0, C: 0, 'C++': 0, Go: 0 }
});

exports.getAnalytics = async () => {
  let analytics = await Analytics.findOne().lean();
  if (!analytics) {
    analytics = await Analytics.create(defaultDocument());
  }
  return analytics;
};

exports.updateAfterReview = async (review) => {
  const doc = await Analytics.findOne() || new Analytics(defaultDocument());
  const score = review.score || 0;
  const totalReviews = doc.totalReviews + 1;
  const averageScore = totalReviews === 0 ? 0 : (doc.averageScore * doc.totalReviews + score) / totalReviews;

  const issueTotals = { High: 0, Medium: 0, Low: 0 };
  review.issues.forEach((issue) => {
    const severity = issue.severity || 'Low';
    if (issueTotals[severity] !== undefined) {
      issueTotals[severity] += 1;
    }
  });

  const languageUsage = { ...doc.languageUsage };
  const langKey = Object.keys(languageUsage).find(k => k.toLowerCase() === (review.language || '').toLowerCase());
  if (langKey) {
    languageUsage[langKey] += 1;
  }

  doc.totalReviews = totalReviews;
  doc.averageScore = Number(averageScore.toFixed(1));
  doc.issueDistribution = {
    High: doc.issueDistribution.High + issueTotals.High,
    Medium: doc.issueDistribution.Medium + issueTotals.Medium,
    Low: doc.issueDistribution.Low + issueTotals.Low
  };
  doc.languageUsage = languageUsage;

  await doc.save();
};

exports.removeReview = async (review) => {
  const doc = await Analytics.findOne();
  if (!doc) return;

  const score = review.score || 0;
  const totalReviews = Math.max(doc.totalReviews - 1, 0);
  const averageScore = totalReviews === 0 ? 0 : Math.max((doc.averageScore * (doc.totalReviews || 1) - score) / totalReviews, 0);

  const issueTotals = { High: 0, Medium: 0, Low: 0 };
  review.issues.forEach((issue) => {
    const severity = issue.severity || 'Low';
    if (issueTotals[severity] !== undefined) {
      issueTotals[severity] += 1;
    }
  });

  const languageUsage = { ...doc.languageUsage };
  const langKey = Object.keys(languageUsage).find(k => k.toLowerCase() === (review.language || '').toLowerCase());
  if (langKey) {
    languageUsage[langKey] = Math.max(languageUsage[langKey] - 1, 0);
  }

  doc.totalReviews = totalReviews;
  doc.averageScore = Number(averageScore.toFixed(1));
  doc.issueDistribution = {
    High: Math.max(doc.issueDistribution.High - issueTotals.High, 0),
    Medium: Math.max(doc.issueDistribution.Medium - issueTotals.Medium, 0),
    Low: Math.max(doc.issueDistribution.Low - issueTotals.Low, 0)
  };
  doc.languageUsage = languageUsage;

  await doc.save();
};
