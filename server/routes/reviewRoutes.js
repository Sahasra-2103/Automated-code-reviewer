const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviews,
  getAnalytics,
  deleteReview
} = require('../controllers/reviewController');
const {
  validateReviewRequest,
  validateObjectId
} = require('../middleware/validationMiddleware');

router.post('/review', validateReviewRequest, createReview);
router.get('/reviews', getReviews);
router.get('/analytics', getAnalytics);
router.delete('/review/:id', validateObjectId, deleteReview);

module.exports = router;
