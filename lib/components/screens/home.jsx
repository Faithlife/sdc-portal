var littlest = require('littlest-isomorph');
var React = require('react');
var App = require('../app.jsx');
var Machine = require('../machine.jsx');

var HomePage = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    machines: 'machine:machines'
  },
  componentDidMount: function () {
    this.fetchMachines(this.props.route.params.user, this.props.route.params.dataCenter);
  },
  componentWillUpdate: function(nextProps, nextState) {
    if (
      nextProps.route.params.user !== this.props.route.params.user ||
      nextProps.route.params.dataCenter !== this.props.route.params.dataCenter
    ) {
      this.fetchMachines(nextProps.route.params.user, nextProps.route.params.dataCenter);
    }
  },
  fetchMachines: function (user, dataCenter) {
    if (!user || !dataCenter) {
      return;
    }

    this.context.performAction('machine:machines:get', {
      dataCenter: dataCenter,
      userId: user,
    });
  },
  render: function () {
    var self = this;

    return (
      <App route={this.props.route}>
        <div className="row">
          {self.state.machines.map(function (machine) {
            return (
              <div className="row__col row__col--3">
                <Machine user={self.props.route.params.user} machine={machine} />
              </div>
            );
          })}
        </div>
      </App>
    );
  }
});

module.exports = HomePage;
