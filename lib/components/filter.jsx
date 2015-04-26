var littlest = require('littlest-isomorph');
var React = require('react');

var Filter = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    filter: 'machine:filter'
  },
  handleFilterChange: function (event) {
    // NOTE: We need to call setState to maintain the caret position (as well
    //   as performAction to update the store).
    this.setState({
      filter: event.target.value
    });
    this.context.performAction('machine:filter:update', {
      filter: event.target.value
    });
  },
  render: function () {
    return (
      <input type="text" className="header__filter" placeholder="Filter" value={this.state.filter} onChange={this.handleFilterChange} />
    );
  }
});

module.exports = Filter;
