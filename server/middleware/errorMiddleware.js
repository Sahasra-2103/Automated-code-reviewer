module.exports = (err, req, res, next) => {
  console.error('[Error Middleware]', {
    message: err.message,
    status: err.status || 500,
    stack: err.stack
  });
  
  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
};
