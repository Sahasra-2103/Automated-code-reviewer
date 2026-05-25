const { createReview } = require('../server/controllers/reviewController');
const { validateReviewRequest } = require('../server/middleware/validationMiddleware');
const { createEndpoint } = require('../server/api/vercelEndpoint');

module.exports = createEndpoint({
  methods: ['POST'],
  validators: [validateReviewRequest],
  handler: createReview
});
