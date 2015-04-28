var logger = require('../logger');
var providers = {};

providers.createProvider = function createProvider(config) {
  var Provider;

  try {
    Provider = require('./' + config.provider);
  } catch (outerErr) {
    try {
      Provider = require(config.provider);
    } catch (innerErr) {
      logger.error('Could not load AuthProvider: %s', config.provider);
      return null;
    }
  }

  logger.info('Initializing AuthProvider: %s', config.provider);

  return new Provider(config);
};

module.exports = providers;
