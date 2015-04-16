var React = require('react');

var Dropdown = React.createClass({
  getDefaultProps: function() {
    return {
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
  render: function () {
    var self = this;

    return (
      <div className={'dropdown' + (self.props.className ? ' ' + self.props.className : '')}>
        <button className="dropdown__selected" onClick={self.toggle}>
          {self.props.value || 'Select...'} <i className="icon-down-open"></i>
        </button>
        <ul className={'dropdown__options' + (self.state.open ? ' dropdown__options--open' : '')}>
          {self.props.options.map(function (option) {
            return (
              <li><button className="dropdown__option" onClick={self.select(option)}>{option}</button></li>
            );
          })}
        </ul>
      </div>
    );
  }
});

module.exports = Dropdown;
