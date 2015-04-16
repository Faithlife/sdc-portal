var littlest = require('littlest-isomorph');
var React = require('react');
var Dropdown = require('./dropdown.jsx');

var App = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    allUsers: 'user:users',
    // allDataCenters: 'datacenter:all',
    activeUser: 'ui:activeUser',
    activeDataCenter: 'ui:activeDataCenter'
  },
  getInitialState: function () {
    return {
      allDataCenters: ['bli', 'sea', 'us-west-1']
    };
  },
  performSelectAction: function (key) {
    var self = this;

    return function (value) {
      self.context.performAction('ui:' + key + ':select', value);
    }
  },
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
          <div className="container">
            <div className="row">
              <a className="header__badge" href={this.context.getRouteUrl('home')}>
                <div className="header__badge__brand">SDC</div>
                <div className="header__badge__name">Developer Portal</div>
              </a>
              <Dropdown className="header__item header__item--blue" options={this.state.allDataCenters} value={this.state.activeDataCenter} onChange={this.performSelectAction('activeDataCenter')}></Dropdown>
              <Dropdown className="header__item header__item--blue" options={this.state.allUsers} value={this.state.activeUser} onChange={this.performSelectAction('activeUser')}></Dropdown>
            </div>
          </div>
        </div>
        <div className="app__sidebar sidebar">
          <h2 className="sidebar__header">Compute</h2>
          <ul>
            <li>
              <a className="sidebar__item sidebar__item--active" href={this.context.getRouteUrl('home')}>
                <i className="icon-cubes"></i> Virtual Machines
              </a>
            </li>
          </ul>
        </div>
        <div className="app__content container">
          <div className="row">
            <div className="row__col row__col--12">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = App;
