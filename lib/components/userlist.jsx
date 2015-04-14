var littlest = require('littlest-isomorph');
var React = require('react');
var superagent = require('superagent');

var UserList = React.createClass({
  mixins: [littlest.Mixin],
  getInitialState: function () {
    return ({
      users: []
    });
  },

  componentDidMount: function () {
    var self = this;

    superagent
      .get('/api/users')
      .end(function (error, response) {
        users = response.body.users;

        if (self.isMounted()) {
          self.setState({
            users: users,
          });
        }
      });
  },

  render: function () {
    var self = this;

    var users = self.state.users.map(function (user) {
      var href = '/machines?user=' + user;
      return (
        <div key={user}>
          <a href={self.context.getRouteUrl('machines', { userId: user })}>
            {user}
          </a>
        </div>
      );
    });

    return <div>{users}</div>;
  }
});

module.exports = UserList;
