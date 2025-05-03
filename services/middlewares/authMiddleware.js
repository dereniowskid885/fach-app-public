// checks if request has valid cookie with token and saves it on req.user for further use in endpoints
const checkAndParseToken = (req, jwt, ACCESS_TOKEN_SECRET) => {
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

const checkUserRole = (req, roles) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error('Forbidden: Required role is missing');
    error.status = 403;
    throw error;
  }
};

module.exports = { checkAndParseToken, checkUserRole };
