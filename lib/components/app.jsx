var littlest = require('littlest-isomorph');
var React = require('react');

var App = React.createClass({
  mixins: [littlest.Mixin],
  render: function () {
    return (
      <div className="app">
        <div className="app__sidebar">
          <h1><a href={this.context.getRouteUrl('home')}>Sdc Portal</a></h1>
          <nav>
            <ul className="nav-list">
              <li><a className="nav-list__item" href={this.context.getRouteUrl('home')}>Home</a></li>
              <li><a className="nav-list__item" href={this.context.getRouteUrl('about')}>About</a></li>
            </ul>
          </nav>
        </div>
        <div className="app__content">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = App;
