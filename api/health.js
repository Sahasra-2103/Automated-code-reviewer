module.exports = (req, res) => {
  res.setHeader('X-ACR-Api-Runtime', 'vercel-function');
  res.status(200).json({ status: 'ok', service: 'Automated Code Reviewer API' });
};
