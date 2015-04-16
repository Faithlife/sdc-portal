var littlest = require('littlest-isomorph');
var React = require('react');
var App = require('../app.jsx');

var BlankPage = React.createClass({
  mixins: [littlest.Mixin],
  render: function () {
    var self = this;

    return (
      <App>
      </App>
    );
  }
});

module.exports = BlankPage;
