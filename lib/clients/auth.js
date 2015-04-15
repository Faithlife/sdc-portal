var OAuth = require('oauth').OAuth;
var config = require('../config').client.auth;
var log = require('../logger');

function AuthProvider() {}

var oauth = new OAuth(
  config.requestTokenUrl,
  config.accessTokenUrl,
  config.consumerKey,
  config.consumerSecret,
  '1.0A',
  config.callbackUrl,
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
	   	res.redirect(config.authorizeUrl + '?oauth_token=' + oauth_token);
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
          config.getUserInfoUrl,
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

module.exports = AuthProvider;
