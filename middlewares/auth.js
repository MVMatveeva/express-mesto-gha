/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('./errors/UnauthorizedError');

const handleAuthError = (res, next) => {
  next(new UnauthorizedError('Необходима авторизация'));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-secret-key');
  } catch (error) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
