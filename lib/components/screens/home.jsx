var littlest = require('littlest-isomorph');
var React = require('react');
var App = require('../app.jsx');
var Machine = require('../machine.jsx');
var Filter = require('../filter.jsx');

var HomePage = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    filter: 'machine:filter',
    machines: 'machine:machines'
  },
  componentDidMount: function () {
    this.fetchMachines(this.props.route.params.user, this.props.route.params.dataCenter);
  },
  componentWillUpdate: function (nextProps, nextState) {
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
      userId: user
    });
  },
  render: function () {
    var self = this;

    return (
      <App route={this.props.route}>
        <div className="row">
          <div className="row__col row__col--6">
            <Filter />
          </div>
        </div>
        <div className="row">
          {self.state.machines
            .filter(function (machine) {
              return !self.state.filter || machine.name.toLowerCase().indexOf(self.state.filter.toLowerCase()) !== -1;
            })
            .map(function (machine) {
            return (
              <div className="row__col row__col--3" key={machine.id}>
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
