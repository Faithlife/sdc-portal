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
      <div className="filter">
        <label className="filter__label">Filter</label>
        <input className="filter__input" type="text" value={this.state.filter} onChange={this.handleFilterChange} />
      </div>
    );
  }
});

module.exports = Filter;
