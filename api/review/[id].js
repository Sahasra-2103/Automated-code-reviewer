const { deleteReview } = require('../../server/controllers/reviewController');
const { validateObjectId } = require('../../server/middleware/validationMiddleware');
const { createEndpoint } = require('../../server/api/vercelEndpoint');

module.exports = createEndpoint({
  methods: ['DELETE'],
  validators: [validateObjectId],
  params: (req) => ({ id: req.query.id }),
  handler: deleteReview
});
