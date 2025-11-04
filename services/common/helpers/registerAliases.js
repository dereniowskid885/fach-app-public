const path = require('path');
const aliases = require('../../alias.config');

// applying common services aliases from alias.config
module.exports = (moduleAlias) => {
  Object.entries(aliases).forEach(([alias, aliasPath]) => {
    moduleAlias.addAlias(alias, path.resolve(__dirname, aliasPath));
  });
};
