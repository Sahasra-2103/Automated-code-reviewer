const connectDB = require('../database/connection');
const errorMiddleware = require('../middleware/errorMiddleware');

const parseJsonBody = async (req) => {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      if (!req.body.trim()) return {};
      try {
        return JSON.parse(req.body);
      } catch (error) {
        error.status = 400;
        error.message = 'Request body must be valid JSON.';
        throw error;
      }
    }

    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    error.status = 400;
    error.message = 'Request body must be valid JSON.';
    throw error;
  }
};

const run = (handler) => async (req, res) => {
  return new Promise((resolve, reject) => {
    const next = (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    };

    try {
      Promise.resolve(handler(req, res, next))
        .then(resolve)
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

exports.createEndpoint = ({ methods, validators = [], handler, params = () => ({}) }) => async (req, res) => {
  res.setHeader('X-ACR-Api-Runtime', 'vercel-function');

  if (!methods.includes(req.method)) {
    res.setHeader('Allow', methods.join(', '));
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} is not allowed for this endpoint.`
    });
  }

  try {
    req.body = await parseJsonBody(req);
    req.params = { ...params(req), ...(req.params || {}) };

    await connectDB();

    for (const validator of validators) {
      await run(validator)(req, res);
      if (res.headersSent) return;
    }

    await run(handler)(req, res);
    
    // Ensure response is sent if handler doesn't send one
    if (!res.headersSent) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('[API Error]', error.message);
    if (!res.headersSent) {
      errorMiddleware(error, req, res, () => {});
    }
  }
};
