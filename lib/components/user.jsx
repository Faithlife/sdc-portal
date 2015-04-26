var littlest = require('littlest-isomorph');
var React = require('react');

var User = React.createClass({
  mixins: [littlest.Mixin],
  renderSSHKeys: function (sshKeys) {
    if (!sshKeys) {
      return;
    }

    var keys = sshKeys.map(function (sshKey) {
      return (
        <div key={sshKey.name} className="user__sshkey">
          <div>{sshKey.name} : {sshKey.fingerprint}</div>
          <div>{sshKey.key}</div>
        </div>
      );
    });

    return keys;
  },
  render: function () {
    var self = this;
    if (!self.props.user) {
      return;
    }

    return (
      <div className="user">
        <div className="user__name">Login: {self.props.user.login}</div>
        <div className="user__sshkeys">SSH Keys</div>
        <div>{self.renderSSHKeys(self.props.user.sshKeys)}</div>
      </div>
    );
  }
});

module.exports = User;
