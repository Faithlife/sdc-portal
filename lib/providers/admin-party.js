/**
 * AdminPartyProvider is an AuthProvider that allows access to all users to all
 * developers.
 */
var express = require('express');
var config = require('../config');
var when = require('when');

/**
 * Creates a new instance of AdminPartyProvider.
 */
function AdminPartyProvider() {
  if (!(this instanceof AdminPartyProvider)) {
    return new AdminPartyProvider();
  }
}

/**
 * Returns an Express subapp responsible for any setup required by the rest of
 * the Provider.
 */
AdminPartyProvider.prototype.subapp = function subapp() {
  return express();
};

/**
 * Returns Connect-style middleware suitable to sign in a new developer.
 */
AdminPartyProvider.prototype.signin = function signin() {
  return function (req, res, next) {
    res
      .status(200)
      .send();
  };
};

/**
 * Returns Connect-style middleware suitable to sign out any currently
 * signed-in developer.
 */
AdminPartyProvider.prototype.signout = function signout() {
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
AdminPartyProvider.prototype.getUsers = function getUsers(req) {
  return when(Object.keys(config.sdc.users));
};

/**
 * Returns a Promise to be fulfilled with an Object representing the currently
 * signed-in developer. If no developer is currently signed in, the Promise
 * will be fulfilled with `null`.
 */
AdminPartyProvider.prototype.getActiveDeveloper = function getActiveDeveloper(req) {
  return when({
    id: null,
    name: 'Admin Party'
  });
};

/*!
 * Export `AdminPartyProvider`.
 */
module.exports = AdminPartyProvider;
