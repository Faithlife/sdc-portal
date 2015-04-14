var littlest = require('littlest-isomorph');
var React = require('react');
var MachineActionsDropdown = require('./machine-actions-dropdown.jsx');

var Machine = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    machine: function () {
      return 'machine:' + this.props.machine.id
    }
  },
  componentDidMount: function () {
    this.context.performAction('machine:poll', {
      userId: this.props.user,
      machineId: this.props.machine.id,
      dataCenter: this.props.machine.dataCenter
    });
  },
  componentWillUnmount: function () {
    // clearInterval(this.interval);
  },
  handleReboot: function () {
    this.context.performAction('machine:reboot', {
      userId: this.props.user,
      machineId: this.props.machine.id,
      dataCenter: this.props.machine.dataCenter
    });
  },
  handleStart: function () {
    this.context.performAction('machine:start', {
      userId: this.props.user,
      machineId: this.props.machine.id,
      dataCenter: this.props.machine.dataCenter
    });
  },
  render: function () {
    return (
      <div className="row machineRow">
        <div className="col-sm-1">{this.state.machine.name}</div>
        <div className="col-sm-1">{this.state.machine.state}</div>
        <div className="col-sm-4">{this.state.machine.computeNode}</div>
        <div className="col-sm-3">{this.state.machine.ips}</div>
        <div className="col-sm-1"><MachineActionsDropdown machine={this.state.machine} handleReboot={this.handleReboot} handleStart={this.handleStart}/></div>
      </div>
    );
  }
});

module.exports = Machine;
