var React = require('react');

var MachineActionsDropdown = React.createClass({
  render: function () {
    return (
      <div className="dropdown">
        <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" id="machineMenu">
          Actions
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" role="menu" aria-labelledby="machineMenu">
          <li role="presentation"><a className="machineAction" role="menuitem" tabIndex="-1" onClick={this.props.handleReboot}>Reboot</a></li>
          <li role="presentation"><a className="machineAction" role="menuitem" tabIndex="-1" onClick={this.props.handleStart}>Start</a></li>
        </ul>
      </div>
    );
  }
});

module.exports = MachineActionsDropdown;
