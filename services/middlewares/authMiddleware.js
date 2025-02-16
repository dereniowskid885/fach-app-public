const ROUTES_SWAGGER = require('../constants/swaggerConstants');

// checks if request has valid cookie with token and saves it for further use in endpoints
const checkAndParseToken = (req, jwt, ACCESS_TOKEN_SECRET) => {
  // skip token check on swagger pages
  if (req.path.startsWith(ROUTES_SWAGGER.BASE)) {
    return;
  }

  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    const error = new Error('Unauthorized: No token provided');
    error.status = 401;
    throw error;
  }

  try {
    const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.user = payload;
  } catch (err) {
    const error = new Error('Forbidden: Invalid token');
    error.status = 403;
    throw error;
  }
};

const checkUserRole = (roles) => (req) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error('Forbidden: Required role is missing');
    error.status = 403;
    throw error;
  }
};

module.exports = { checkAndParseToken, checkUserRole };
