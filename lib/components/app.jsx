var littlest = require('littlest-isomorph');
var React = require('react');
var Dropdown = require('./dropdown.jsx');

var App = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    allUsers: 'user:users',
    allDataCenters: 'dataCenter:dataCenters',
    developer: 'developer:current',
  },
  propTypes: {
    route: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      params: React.PropTypes.object.isRequired
    })
  },
  componentWillMount: function () {
    var self = this;
    self.context.performAction('dataCenter:dataCenters:get');

    if (self.props.route.params.dataCenter) {
      self.context.performAction('user:users', { dataCenter: self.props.route.params.dataCenter });
    }
  },
  performSelectAction: function (key) {
    var self = this;

    return function (value) {
      if (key === 'dataCenter') {
        self.context.performAction('user:users', { dataCenter: value });
      }

      var params = JSON.parse(JSON.stringify(self.props.route.params));
      params[key] = value;
      self.context.navigateToRoute(self.props.route.name, params);
    };
  },
  componentDidMount: function () {
    this.context.performAction('developer:current:get');
  },
  renderAuthItem: function () {
    if (this.state.developer) {
      if (!this.state.developer.id) {
        return <span className="header__item header__item--right">{this.state.developer.name}</span>
      }

      return (
        <a className="header__item header__item--right" href={this.context.getRouteUrl('signout')}>
          {this.state.developer.name} <i className="icon-logout"></i>
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
          <a className="header__badge" href={this.context.getRouteUrl('home', this.props.route.params)}>
            <div className="header__badge__brand">SDC</div>
            <div className="header__badge__name">Developer Portal</div>
          </a>
          <Dropdown className="header__item header__item--blue header__item--button"
            options={this.state.allDataCenters}
            value={this.props.route.params.dataCenter}
            onChange={this.performSelectAction('dataCenter')}
            label="datacenter"
            icon="globe"
            />
          <Dropdown className="header__item header__item--blue header__item--button"
            options={this.state.allUsers.map(function (user) { return user.name; })}
            value={this.props.route.params.user}
            onChange={this.performSelectAction('user')}
            label="user"
            icon="user"
            />
          {this.renderAuthItem()}
        </div>
        <div className="app__sidebar sidebar">
          <h2 className="sidebar__header">Compute</h2>
          <ul>
            <li>
              <a className="sidebar__item sidebar__item--active" href={this.context.getRouteUrl('home', this.props.route.params)}>
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
