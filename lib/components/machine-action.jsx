var React = require('react');

var MachineAction = React.createClass({
  getInitialState: function () {
    return {
      isConfirming: false
    }
  },
  handleClick: function () {
    var self = this;

    self.setState({
      isConfirming: true
    });

    setTimeout(function () {
      self.setState({
        isConfirming: false
      });
    }, 2000);
  },
  handleConfirm: function () {
    this.props.handleOnClick();

    this.setState({
      isConfirming: false
    });
  },
  renderConfirmButton: function () {
    return (
      <button className='machine__action machine__action--confirm' tabIndex="-1" onClick={this.handleConfirm} key={this.props.key}>
        <i className='icon-ok'></i> Confirm
      </button>
    )
  },
  renderDefaultButton: function () {
    return (
      <button className='machine__action' tabIndex="-1" onClick={this.handleClick} key={this.props.key}>
        <i className={this.props.icon}></i> {this.props.label}
      </button>
    )
  },
  render: function () {
    return this.state.isConfirming ?
      this.renderConfirmButton() :
      this.renderDefaultButton();
  }
});

module.exports = MachineAction;
