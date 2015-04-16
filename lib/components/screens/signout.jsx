var React = require('react');

/*
 * The auth provider should probably handle this, but for now we'll redirect
 * straight to our auth api.
 */
var SignOutPage = React.createClass({
  componentDidMount: function () {
    window.location = "/api/signout";
  },
  render: function () {
    return null;
  }
});

module.exports = SignOutPage;
