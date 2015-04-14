var React = require('react');
var App = require('../app.jsx');
var UserList = require('../userlist.jsx');

var HomePage = React.createClass({
  render: function () {
    return (
      <App>
        <UserList />
      </App>
    );
  }
});

module.exports = HomePage;
