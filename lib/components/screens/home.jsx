var littlest = require('littlest-isomorph');
var React = require('react');
var App = require('../app.jsx');
var Machine = require('../machine.jsx');

var HomePage = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    activeUser: 'ui:activeUser',
    activeDataCenter: 'ui:activeDataCenter',
    machines: 'machine:machines'
  },
  componentDidMount: function () {
    this.fetchMachines(this.state.activeUser, this.state.activeDataCenter);
  },
  componentWillUpdate: function(nextProps, nextState) {
    if (
      nextState.activeUser !== this.state.activeUser ||
      nextState.activeDataCenter !== this.state.activeDataCenter
    ) {
      this.fetchMachines(nextState.activeUser, nextState.activeDataCenter);
    }
  },
  fetchMachines: function (user, dataCenter) {
    if (!user || !dataCenter) {
      return;
    }

    this.context.performAction('machine:machines:get', {
      userId: user
    });
  },
  render: function () {
    var self = this;

    return (
      <App>
        <div className="row">
          {self.state.machines.map(function (machine) {
            return (
              <div className="row__col row__col--3">
                <Machine user={self.state.activeUser} machine={machine} />
              </div>
            );
          })}
        </div>
      </App>
    );
  }
});

module.exports = HomePage;
