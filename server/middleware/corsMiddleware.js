const cors = require('cors');
const { corsOrigin } = require('../config');

module.exports = () => cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
});
