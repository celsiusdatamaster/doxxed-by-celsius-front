'use strict';

function addonConfigs() {
  return {
    'ember-bootstrap': require('./ember-bootstrap'),
    'ember-fetch': {
      preferNative: true,
    },
    postcssOptions: require('./postcss'),
  };
}

module.exports = {
  addonConfigs,
};
