var littlest = require('littlest-isomorph');
var React = require('react');
var App = require('../app.jsx');
var User = require('../user.jsx');

var UserPage = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    user: 'user:user'
  },
  componentDidMount: function () {
    this.fetchUser(this.props.route.params.dataCenter, this.props.route.params.user);
  },
  componentWillUpdate: function (nextProps, nextState) {
    if (
      nextProps.route.params.user !== this.props.route.params.user ||
      nextProps.route.params.dataCenter !== this.props.route.params.dataCenter
    ) {
      this.fetchUser(nextProps.route.params.dataCenter, nextProps.route.params.user);
    }
  },
  fetchUser: function (dataCenter, user) {
    if (!dataCenter || !user) {
      return;
    }

    this.context.performAction('user:get', {
      dataCenter: dataCenter,
      userId: user
    });
  },
  render: function () {
    var self = this;

    return (
      <App route={this.props.route}>
        <User user={this.state.user} dataCenter={this.props.route.params.dataCenter} />
      </App>
    );
  }
});

module.exports = UserPage;
