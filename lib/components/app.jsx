var littlest = require('littlest-isomorph');
var React = require('react');

var App = React.createClass({
  mixins: [littlest.Mixin],
  renderHeader: function () {
    var signIn = <li><a href="/auth/signin">Sign in</a></li>;
    if (this.props.userId !== -1 && this.props.email !== '') {
      signIn = <li><p className="navbar-text">Signed in as {this.props.email}</p></li>
    }
    return (
      <nav className="navbar navbar-default" role="navigation">
        <div className="container-fluid">
          <a className="navbar-brand" href={this.context.getRouteUrl('home')}>SDCPortal</a>
          <ul className="nav navbar-nav navbar-right">
            {signIn}
          </ul>
        </div>
      </nav>
    );
  },
  render: function () {
    return (
      <div className="app">
        <div className="app__header">
          {this.renderHeader()}
        </div>
        <div className="app__content">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = App;
