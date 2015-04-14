var React = require('react');
var config = require('../../config');
var App = require('../app.jsx');

var About = React.createClass({
  render: function () {
    return (
      <App>
        <h1>About</h1>
        <p>Config:</p>
        <pre><code>{JSON.stringify(config, null, 2)}</code></pre>
      </App>
    );
  }
});

module.exports = About;
