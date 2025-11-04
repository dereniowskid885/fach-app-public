const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateTokens = (req, res, user) => {
  const accessToken = generateAccessToken(req, res, user);
  const { refreshToken, refreshTokenData } = generateRefreshToken(req, res, user);
  return { accessToken, refreshToken, refreshTokenData };
};

const generateAccessToken = (req, res, user) => {
  const { _id, role, email, name, surname, city } = user;
  const fullName = `${name} ${surname}`;
  const accessToken = jwt.sign(
    { userId: _id, role, email, name, surname, fullName, city },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m',
    },
  );

  const expirationTime = 900000; // 15 minutes - 15 * 60 * 1000

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expirationTime,
    expirationTime: expirationTime,
  });

  return accessToken;
};

const generateRefreshToken = (req, res, user) => {
  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  const expirationTime = 604800000; // 7 days - 7 * 24 * 60 * 60 * 1000

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expirationTime,
    expirationTime: expirationTime,
  });

  const refreshTokenData = {
    token: refreshToken,
    deviceInfo: req.headers['user-agent'],
    expiresAt: new Date(Date.now() + expirationTime),
    createdAt: new Date(),
  };

  return { refreshToken, refreshTokenData };
};

const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = { generateTokens, generateAccessToken, generateRefreshToken, generateRandomToken };
