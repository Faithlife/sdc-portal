/**
 * OAuthProvider is an AuthProvider that maps accounts from an OAuth 1.0A
 * provider to users in SDC. See `OAuthProvider` for options, and see
 * http://oauth.net/core/1.0a for more information about OAuth 1.0A.
 */
var url = require('url');
var session = require('cookie-session');
var express = require('express');
var oauth = require('oauth');
var when = require('when');
var config = require('../config');
var logger = require('../logger');

/**
 * Creates a new instance of OAuthProvider with the provided `options`.
 *
 * Available options:
 * - `requestTokenUrl`: The OAuth Request Token URL.
 * - `authorizeUrl`: The OAuth User Authorization URL.
 * - `accessTokenUrl`: The OAuth Access Token URL.
 * - `consumerKey`: The OAuth Consumer Key.
 * - `consumerSecret`: The OAuth Consumer Secret.
 * - `session`: Session settings as defined by http://npmjs.org/cookie-session.
 * - `developerInfoUrl`: A URL to GET once sign-in is successful. It should
 *   return a JSON body with metadata (name, id, etc.) for the developer.
 * - `developerIdKey`: The path within the `developerInfoUrl` response to use
 *   as the developer's ID.
 * - `developerNameKey`: The path within the `developerInfoUrl` response to use
 *   as the developer's public, displayable name.
 * - `developers`: An Object mapping developer IDs to Arrays of legal SDC user
 *   logins. The identified developer will be granted complete access to those
 *   users.
 *
 * @param {Object} options
 */
function OAuthProvider(options) {
  if (!(this instanceof OAuthProvider)) {
    return new OAuthProvider(options);
  }

  options = options || {};

  this.developers = options.developers;

  this._sessionOpts = options.session || { secret: 'shhh' };
  this._developerInfoUrl = options.developerInfoUrl || null;
  this._developerIdKey = options.developerIdKey || 'id';
  this._developerNameKey = options.developerNameKey || 'name';

  this._requestTokenUrl = options.requestTokenUrl || null;
  this._authorizeUrl = options.authorizeUrl || null;
  this._accessTokenUrl = options.accessTokenUrl || null;
  this._consumerKey = options.consumerKey || null;
  this._consumerSecret = options.consumerSecret || null;
}

/**
 * Returns an Express subapp responsible for any setup required by the rest of
 * the Provider.
 */
OAuthProvider.prototype.subapp = function subapp() {
  var self = this;
  var app = express();

  app.use(session(self._sessionOpts));

  app.use(function (req, res, next) {
    req._consumer = new oauth.OAuth(
      self._requestTokenUrl,
      self._accessTokenUrl,
      self._consumerKey,
      self._consumerSecret,
      '1.0A',
      url.format({
        protocol: req.protocol,
        host: req.headers.host,
        pathname: req.baseUrl + '/authorize'
      }),
      'PLAINTEXT'
    );

    next();
  });

  app.get('/authorize', function (req, res, next) {
    when.promise(function (resolve, reject) {
      req._consumer.getOAuthAccessToken(
        req.session.requestToken,
        req.session.requestSecret,
        req.param('oauth_verifier'),
        function (err, accessToken, accessSecret) {
          if (err) {
            return reject(err);
          }

          req.session.accessToken = accessToken;
          req.session.accessSecret = accessSecret;

          resolve();
        }
      );
    })
      .then(function () {
        return when.promise(function (resolve, reject) {
          req._consumer.get(
            self._developerInfoUrl,
            req.session.accessToken,
            req.session.accessSecret,
            function (err, data) {
              if (err) {
                return reject(err);
              }

              data = JSON.parse(data);
              req.session.developerId = data[self._developerIdKey];
              req.session.developerName = data[self._developerNameKey];

              resolve();
            }
          );
        });
      })
      .then(null, function (err) {
        logger.error('Authorize failed with: %s', err.message);
      })
      .then(function () {
        res.redirect('/');
      });
  });

  return app;
};

/**
 * Returns Connect-style middleware suitable to sign in a new developer.
 */
OAuthProvider.prototype.signin = function signin() {
  var self = this;

  return function (req, res, next) {
    req._consumer.getOAuthRequestToken(function (err, requestToken, requestSecret) {
      if (err) {
        logger.error('Error getting oauth request token: %s', err.message);
        return;
      }

      req.session.requestToken = requestToken;
      req.session.requestSecret = requestSecret;

      // Redirect the user to authorize the token.
      res.redirect(self._authorizeUrl + '?oauth_token=' + requestToken);
    });
  };
};

/**
 * Returns Connect-style middleware suitable to sign out any currently
 * signed-in developer.
 */
OAuthProvider.prototype.signout = function signout() {
  return function (req, res, next) {
    req.session = null;

    return res.redirect('/');
  };
};

/**
 * Returns a Promise to be fulfilled with an Array of SDC logins, represented
 * as Strings, that the currently signed-in developer has access to.
 */
OAuthProvider.prototype.getUsers = function getUsers(req) {
  var self = this;

  return when.promise(function (resolve, reject) {
    if (req.session) {
      resolve();
    }

    // Remember: This populates `req.session`.
    session(self._sessionOpts)(req, {}, resolve);
  })
    .then(function () {
      return self.developers[req.session.developerId] || [];
    });
};

/**
 * Returns a Promise to be fulfilled with an Object representing the currently
 * signed-in developer. If no developer is currently signed in, the Promise
 * will be fulfilled with `null`.
 */
OAuthProvider.prototype.getActiveDeveloper = function getActiveDeveloper(req) {
  if (!req.session.developerId) {
    return when(null);
  }

  return when({
    id: req.session.developerId,
    name: req.session.developerName
  });
};

/*!
 * Export `OAuthProvider`.
 */
module.exports = OAuthProvider;
