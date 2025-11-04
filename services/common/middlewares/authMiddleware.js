// checks if request has valid cookie with access token and saves it on req.user for further use in endpoints
const checkAndParseAccessToken = (req, jwt, ACCESS_TOKEN_SECRET) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    const error = new Error('Unauthorized: No access token provided');
    error.status = 401;
    throw error;
  }

  try {
    const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.user = payload;
  } catch (err) {
    const error = new Error('Forbidden: Invalid access token');
    error.status = 403;
    throw error;
  }
};

const checkRefreshToken = (req, jwt, REFRESH_TOKEN_SECRET) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    const error = new Error('Unauthorized: No refresh token provided');
    error.status = 401;
    throw error;
  }

  try {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (err) {
    const error = new Error('Forbidden: Invalid refresh token');
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

module.exports = { checkAndParseAccessToken, checkRefreshToken, checkUserRole };
