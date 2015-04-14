var littlest = require('littlest-isomorph');
var React = require('react');
var superagent = require('superagent');
var App = require('../app.jsx');
var Machine = require('../machine.jsx');

var MachinesPage = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    machines: 'machine:machines'
  },
  componentDidMount: function () {
    this.context.performAction('machine:machines:get', { user: this.props.route.params.userId });
  },
  render: function () {
    var self = this;

    if (!self.state.machines) {
      return null;
    }

    var machines = this.state.machines.map(function (machine) {
      return <Machine key={machine.id} machine={machine} user={self.props.route.params.userId}/>
    });
    return (
      <App>
        <h3>Machines for {self.props.route.params.userId}</h3>
        <div className="container-fluid">
          <h4>
          <div className="row">
            <div className="col-sm-1">Name</div>
            <div className="col-sm-1">State</div>
            <div className="col-sm-4">Compute Node</div>
            <div className="col-sm-3">IPs</div>
            <div className="col-sm-1"></div>
          </div>
          </h4>
          {machines}
        </div>
      </App>
    );
  }
});

module.exports = MachinesPage;
