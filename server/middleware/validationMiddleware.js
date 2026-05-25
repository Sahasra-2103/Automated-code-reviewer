const Joi = require('joi');
const { Types } = require('mongoose');
const validator = require('validator');

const reviewSchema = Joi.object({
  code: Joi.string().min(5).required(),
  language: Joi.string().valid('javascript', 'typescript', 'python', 'java', 'c', 'c++', 'go').required()
});

const trimString = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim();
};

const sanitizeLanguage = (value) => {
  if (typeof value !== 'string') return value;
  return validator.escape(value.trim().toLowerCase());
};

exports.validateReviewRequest = (req, res, next) => {
  const cleanBody = {
    code: trimString(req.body.code || ''),
    language: sanitizeLanguage(req.body.language || '')
  };

  const { error, value } = reviewSchema.validate(cleanBody);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  req.body = value;
  next();
};

exports.validateObjectId = (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid review id' });
  }
  next();
};
