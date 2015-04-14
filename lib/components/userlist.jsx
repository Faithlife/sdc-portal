var littlest = require('littlest-isomorph');
var React = require('react');

var UserList = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    users: 'user:users'
  },
  componentDidMount: function () {
    this.context.performAction('user:users');
  },
  render: function () {
    var self = this;

    if (!self.state.users) {
      return null;
    }

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
