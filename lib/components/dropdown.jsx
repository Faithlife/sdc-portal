var React = require('react');

var Dropdown = React.createClass({
  getDefaultProps: function () {
    return {
      icon: null,
      label: null,
      value: null,
      onChange: function () {}
    };
  },
  getInitialState: function () {
    return {
      open: false
    };
  },
  toggle: function (event) {
    event.preventDefault();

    this.setState({
      open: !this.state.open
    });
  },
  select: function (option) {
    var self = this;

    return function (event) {
      event.preventDefault();

      self.setState({
        open: false
      });

      self.props.onChange(option);
    };
  },
  renderIcon: function () {
    if (!this.props.icon) {
      return null;
    }

    return <i className={'icon-' + this.props.icon}></i>;
  },
  renderLabel: function () {
    if (!this.props.value || !this.props.label) {
      return null;
    }

    return <div className="dropdown__label">{this.props.label}</div>
  },
  render: function () {
    var self = this;

    return (
      <div className={'dropdown' + (self.props.className ? ' ' + self.props.className : '')}>
        {this.renderLabel()}
        <button className="dropdown__selected" onClick={self.toggle}>
          {this.renderIcon()} {this.props.value || this.props.label || 'Select...'} <i className="icon-down-open"></i>
        </button>
        <ul className={'dropdown__options' + (self.state.open ? ' dropdown__options--open' : '')}>
          {self.props.options.map(function (option) {
            return (
              <li key={option}><button className="dropdown__option" onClick={self.select(option)}>{option}</button></li>
            );
          })}
        </ul>
      </div>
    );
  }
});

module.exports = Dropdown;
