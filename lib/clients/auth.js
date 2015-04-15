var OAuth = require('oauth').OAuth;
var authConfig = require('../config').client.auth;
var sdcUsersConfig = require('../config').sdc.users;
var log = require('../logger');

function AuthProvider() {}

var oauth = new OAuth(
  authConfig.requestTokenUrl,
  authConfig.accessTokenUrl,
  authConfig.consumerKey,
  authConfig.consumerSecret,
  '1.0A',
  authConfig.callbackUrl,
  'PLAINTEXT'
);

AuthProvider.prototype.authenticate = function (req, res) {
  oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results){
    if(error) {
      log.error('Error getting oauth request token');
      log.error(error);
		}
    else {
			req.session.oauth_token = oauth_token;
			req.session.oauth_token_secret = oauth_token_secret;

			// redirect the user to authorize the token
	   	res.redirect(authConfig.authorizeUrl + '?oauth_token=' + oauth_token);
    }
  });
};

AuthProvider.prototype.authorize = function (req, res) {
  oauth.getOAuthAccessToken(req.session.oauth_token, req.session.oauth_token_secret, req.param('oauth_verifier'),
    function (error, oauth_access_token, oauth_access_token_secret, results) {
      if(error) {
        log.error('Error getting oauth access token');
        log.error(error);

        return res
          .redirect('/');
      }
	 		else {
        req.session.oauth_access_token = oauth_access_token
        req.session.oauth_access_token_secret = oauth_access_token_secret

        oauth.get(
          authConfig.getUserInfoUrl,
          req.session.oauth_access_token,
          req.session.oauth_access_token_secret,
          function (error, data, response) {
            if (error) {
              log.error('Error getting user info.');
              log.error(error);
            }
            else {
              jsonData = JSON.parse(data);
              req.session.userId = jsonData.userId
              req.session.userAlias = jsonData.alias;
            }

            return res
              .redirect('/');
          }
        );
      }
    });
};

AuthProvider.prototype.getSDCUsers = function (req, res) {
  var userId = req.session.userId;

  var users = [];
  for (var sdcUser in sdcUsersConfig) {
    if (sdcUsersConfig[sdcUser].usersAllowed.indexOf(userId) > -1) {
      users.push(sdcUser);
    }
  }

  return users;
};

AuthProvider.prototype.hasAccessToSDCUser = function (req, res, user) {
  var userId = req.session.userId;

  if (userId === undefined) {
    return false;
  }

  var sdcUser = sdcUsersConfig[user];
  if (sdcUser !== undefined && sdcUser.usersAllowed.indexOf(userId) > -1) {
    return true;
  }

  return false;
};

AuthProvider.prototype.isAuthenticated = function (req, res) {
  return (req.session !== undefined && req.session.userId !== undefined && req.session.userAlias !== undefined) === true;
};

module.exports = AuthProvider;
