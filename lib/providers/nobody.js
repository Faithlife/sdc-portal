/**
 * NobodyAuthProvider is an AuthProvider that denies access to all users to all
 * developers.
 */
var express = require('express');
var when = require('when');

/**
 * Creates a new instance of NobodyAuthProvider.
 */
function NobodyAuthProvider() {
  if (!(this instanceof NobodyAuthProvider)) {
    return new NobodyAuthProvider();
  }
}

/**
 * Returns an Express subapp responsible for any setup required by the rest of
 * the Provider.
 */
NobodyAuthProvider.prototype.subapp = function subapp() {
  return express();
};

/**
 * Returns Connect-style middleware suitable to sign in a new developer.
 */
NobodyAuthProvider.prototype.signin = function signin() {
  return function (req, res, next) {
    res
      .status(403)
      .send();
  };
};

/**
 * Returns Connect-style middleware suitable to sign out any currently
 * signed-in developer.
 */
NobodyAuthProvider.prototype.signout = function signout() {
  return function (req, res, next) {
    res
      .status(200)
      .send();
  };
};

/**
 * Returns a Promise to be fulfilled with an Array of SDC logins, represented
 * as Strings, that the currently signed-in developer has access to.
 */
NobodyAuthProvider.prototype.getUsers = function getUsers(req) {
  return when([]);
};

/**
 * Returns a Promise to be fulfilled with an Object representing the currently
 * signed-in developer. If no developer is currently signed in, the Promise
 * will be fulfilled with `null`.
 */
NobodyAuthProvider.prototype.getActiveDeveloper = function getActiveDeveloper(req) {
  return when({
    id: null,
    name: 'Nobody'
  });
};

/*!
 * Export `NobodyAuthProvider`.
 */
module.exports = NobodyAuthProvider;
