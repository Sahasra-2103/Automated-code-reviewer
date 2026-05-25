require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const corsMiddleware = require('./middleware/corsMiddleware');
const requestLogger = require('./middleware/requestLogger');
const rateLimiter = require('./middleware/rateLimiter');
const errorMiddleware = require('./middleware/errorMiddleware');
const connectDB = require('./database/connection');
const reviewRoutes = require('./routes/reviewRoutes');

connectDB();

const app = express();

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(corsMiddleware());
app.use(requestLogger);
app.use(rateLimiter);

app.use('/api', reviewRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Automated Code Reviewer API' });
});

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    method: req.method,
    path: req.originalUrl
  });
});

app.use(errorMiddleware);

if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
