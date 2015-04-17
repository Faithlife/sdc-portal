var littlest = require('littlest-isomorph');
var React = require('react');

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
    this.context.performAction('machine:poll:stop', {
      machineId: this.props.machine.id
    });
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
  renderStateIcon: function (state) {
    if (state === 'running' || state === 'ready') {
      return <i className="icon-ok"></i>;
    }

    return <i className="icon-attention-alt"></i>
  },
  render: function () {
    return (
      <div className={'machine' + (this.props.className ? ' ' + this.props.className : '')}>
        <div className="machine__name">{this.state.machine.name}</div>
        <div className={'machine__state machine__state--' + this.state.machine.state} title={this.state.machine.state}>{this.renderStateIcon(this.state.machine.state)} {this.state.machine.state}</div>
        <div className="machine__meta">{this.state.machine.computeNode}</div>
        <div className="machine__meta">{this.state.machine.ips}</div>
        <div className="machine__actions">
          <button className="machine__action" tabIndex="-1" onClick={this.handleReboot}><i className="icon-ccw"></i> Reboot</button>
          <button className="machine__action" tabIndex="-1" onClick={this.handleStart}><i className="icon-off"></i> Start</button>
        </div>
      </div>
    );
  }
});

module.exports = Machine;
