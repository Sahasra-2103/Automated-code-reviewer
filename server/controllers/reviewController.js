const reviewService = require('../services/reviewService');
const analyticsService = require('../services/analyticsService');

exports.createReview = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const review = await reviewService.createReview(code, language);
    await analyticsService.updateAfterReview(review);

    res.status(201).json({
      success: true,
      review: {
        summary: review.reviewSummary,
        score: `${review.score}/10`,
        issues: review.issues,
        improvedCode: review.improvedCode,
        bestPractices: review.bestPractices
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.listReviews();
    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getAnalytics();
    res.json({ success: true, analytics });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const deletedReview = await reviewService.deleteReview(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    await analyticsService.removeReview(deletedReview);
    res.json({ success: true, message: 'Review removed successfully' });
  } catch (error) {
    next(error);
  }
};
