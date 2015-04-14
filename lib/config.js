'use strict';

/*!
 * Config.js is responsible for rendering the top-level configuration as
 * required by client, server, or both. _No information should exist here that
 * cannot be seen by the client_, as Browserify will bundle the generated
 * code with the client.
 *
 * If the configuration doesn't seem to match on the client and on the server,
 * _make sure the same environment variables are specified on both!_
 */
var os = require('os');
var env = process.env.NODE_ENV || 'development';
var hostname = process.env.HOSTNAME || '0.0.0.0';
var port = process.env.PORT || 8080;
var validEnvs = ['development', 'production'];

if (validEnvs.indexOf(env) === -1) {
  throw new Error('Invalid environment name:', env);
}

function byEnv(config) {
  validEnvs.forEach(function (name) {
    if (typeof config[name] === 'undefined') {
      console.warn('Configuration missing value for environment:', name);
    }
  });

  return config[env];
}

module.exports = {
  env: env,
  hostname: hostname,
  port: port,
  cluster: {
    instances: byEnv({
      development: 2,
      production: os.cpus().length
    })
  },
  logger: {
    format: byEnv({
      development: 'dev',
      production: 'combined'
    })
  },
  client: {
    flickr: {
      upstream: {
        apiKey: '0cd1abd425f132a1e19971b61206fb0e',
        rootUrl: 'https://api.flickr.com/services/rest'
      },
      proxy: {
        apiKey: '0cd1abd425f132a1e19971b61206fb0e',
        rootUrl: '/api/flickr'
      }
    }
  }
};
