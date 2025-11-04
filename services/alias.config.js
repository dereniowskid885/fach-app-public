const path = require('path');

module.exports = {
  '@root': path.resolve(__dirname, './'),
  '@helpers': path.resolve(__dirname, 'common/helpers'),
  '@middlewares': path.resolve(__dirname, 'common/middlewares'),
  '@constants': path.resolve(__dirname, 'common/constants'),
};
