var React = require('react');
var superagent = require('superagent');
var MachineActionsDropdown = require('./machine-actions-dropdown.jsx');

var Machine = React.createClass({

  getInitialState: function () {
    return (
      { state: this.props.machine.state }
    );
  },

  checkState: function () {
    var self = this;

    self.updateMachineState = function (state) {
      self.setState({
        state: state
      });
    };

    superagent
      .get('/api/machines/' + this.props.machine.id + '?user=' + this.props.user + '&dataCenter=' + this.props.machine.dataCenter)
      .end(function (error, response) {
        self.updateMachineState(response.body.state);
      });
  },

  componentDidMount: function () {
    this.interval = setInterval(this.checkState, 5000);
  },

  componentWillUnmount: function () {
    clearInterval(this.interval);
  },

  handleReboot: function () {
    superagent
      .post('/api/machines/' + this.props.machine.id + '/reboot?user=' + this.props.user)
      .send({ dataCenter: this.props.machine.dataCenter })
      .end(function (error, response) {
        if (error) {
          console.log('Error rebooting machine: ' + this.props.machine.name);
          console.log(error);
        }
      });
  },

  handleStart: function () {
    superagent
      .post('/api/machines/' + this.props.machine.id + '/start?user=' + this.props.user)
      .send({ dataCenter: this.props.machine.dataCenter })
      .end(function (error, response) {
        if (error) {
          console.log('Error starting machine: ' + this.props.machine.name);
          console.log(error);
        }
      });
  },

  render: function () {
    return (
      <div className="row machineRow">
        <div className="col-sm-1">{this.props.machine.name}</div>
        <div className="col-sm-1">{this.state.state}</div>
        <div className="col-sm-4">{this.props.machine.computeNode}</div>
        <div className="col-sm-3">{this.props.machine.ips}</div>
        <div className="col-sm-1"><MachineActionsDropdown machine={this.props.machine} handleReboot={this.handleReboot} handleStart={this.handleStart}/></div>
      </div>
    );
  }
});

module.exports = Machine;
