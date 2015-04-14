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
var path = require('path');
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
  },
  sdc: {
    dataCenters: {
      bli: {
        cloudapiUrl: 'https://bli-sdc01-api.faithlife.io'
      },
      sea: {
        cloudapiUrl: 'https://sea-sdc01-api.faithlife.io'
      }
    },
    users: {
      Admin: { key: "/opt/sdc_keys/admin_rsa", keyId: "FC\ sdc\ key", login: "admin" },
      CoreServices: { key: "/opt/sdc_keys/core_rsa", keyId: "core_key", login: "CoreServices" },
      Amber: { key: path.resolve(process.env.HOME, '.ssh', 'shared', 'amb-bli.pem'), keyId: "amber_key", login: "Amber" },
      Analytics: { key: "/opt/sdc_keys/analytics_rsa", keyId: "analytics_key", login: "Analytics" },
      Commerce: { key: "/opt/sdc_keys/commerce_rsa", keyId: "commerce_hack_key", login: "Commerce" },
      DigitalLibrary: { key: "/opt/sdc_keys/dlo_rsa", keyId: "dlo_key", login: "DigitalLibrary" },
      Documents: { key: "/opt/sdc_keys/documents_rsa", keyId: "documents_key", login: "Documents" },
      Faithlife: { key: "/opt/sdc_keys/faithlife_rsa", keyId: "faithlife_key", login: "Faithlife" },
      Marketing: { key: "/opt/sdc_keys/marketing_rsa", keyId: "marketing_key", login: "Marketing" },
      Operations: { key: "/opt/sdc_keys/operations_rsa", keyId: "operations_key", login: "Operations" },
      Proclaim: { key: "/opt/sdc_keys/proclaim_rsa", keyId: "proclaim_key", login: "Proclaim" },
      WebServices: { key: "/opt/sdc_keys/webservices_rsa", keyId: "webservices_key", login: "WebServices" }
    }
  }
};
