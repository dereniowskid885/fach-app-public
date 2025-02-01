// method for using common middleware functions across services
const createMiddleware = (handlerFunction, ...params) => {
  return async (req, res, next) => {
    try {
      await handlerFunction(req, ...params);
      next();
    } catch (err) {
      return res.status(err.status || 500).json({ message: err.message || 'Server error' });
    }
  };
};

module.exports = createMiddleware;