var littlest = require('littlest-isomorph');
var logger = require('./logger');

module.exports = littlest.createContext({
  logger: logger,
});

// Since we perform Actions and get Stores by name, we need to bootstrap them
// somewhere. How about here? There's no magic going on here, we're just
// using `require` to ensure some JavaScript gets run, populating our Context.
require('./actions/photos');
require('./stores/photos');
require('./router');
