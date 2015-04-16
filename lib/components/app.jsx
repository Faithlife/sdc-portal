var littlest = require('littlest-isomorph');
var React = require('react');
var Dropdown = require('./dropdown.jsx');

var App = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    allUsers: 'user:users',
    allDataCenters: 'dataCenter:dataCenters',
    activeUser: 'ui:activeUser',
    activeDataCenter: 'ui:activeDataCenter',
    user: 'user:user'
  },
  componentWillMount: function () {
    this.context.performAction('dataCenter:dataCenters:get');
    this.context.performAction('user:users');
  },
  performSelectAction: function (key) {
    var self = this;

    return function (value) {
      self.context.performAction('ui:' + key + ':select', value);
    }
  },
  componentDidMount: function () {
    this.context.performAction('user:getme');
  },
  renderAuthItem: function () {
    if (this.state.user && this.state.user.id !== -1) {
      return (
        <a className="header__item header__item--right" href={this.context.getRouteUrl('signout')}>
          {this.state.user.alias} <i className="icon-logout"></i>
        </a>
      );
    }

    return (
      <a className="header__item header__item--right" href={this.context.getRouteUrl('signin')}>
        Sign in <i className="icon-login"></i>
      </a>
    );
  },
  render: function () {
    return (
      <div className="app">
        <div className="app__header">
          <a className="header__badge" href={this.context.getRouteUrl('home')}>
            <div className="header__badge__brand">SDC</div>
            <div className="header__badge__name">Developer Portal</div>
          </a>
          <Dropdown className="header__item header__item--blue" options={this.state.allDataCenters} value={this.state.activeDataCenter} onChange={this.performSelectAction('activeDataCenter')}></Dropdown>
          <Dropdown className="header__item header__item--blue" options={this.state.allUsers} value={this.state.activeUser} onChange={this.performSelectAction('activeUser')}></Dropdown>
          {this.renderAuthItem()}
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
