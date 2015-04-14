var React = require('react');
var superagent = require('superagent');
var App = require('../app.jsx');
var Machine = require('../machine.jsx');

var MachinesPage = React.createClass({
  getInitialState: function () {
    return ({
      machines: []
    });
  },

  componentDidMount: function () {
    var self = this;
    var user = self.props.route.params.userId;

    self.setStateIfMounted = function(machines) {
      if (self.isMounted()) {
        self.setState({
          machines: machines
        });
      }
    };

    superagent
      .get('/api/machines?user=' + user)
      .end(function (error, response) {
        self.setStateIfMounted(response.body.machines);
      });
  },

  render: function () {
    var self = this;
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
