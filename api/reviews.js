const { getReviews } = require('../server/controllers/reviewController');
const { createEndpoint } = require('../server/api/vercelEndpoint');

module.exports = createEndpoint({
  methods: ['GET'],
  handler: getReviews
});
