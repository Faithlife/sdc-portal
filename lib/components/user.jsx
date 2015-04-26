var littlest = require('littlest-isomorph');
var React = require('react');

var User = React.createClass({
  mixins: [littlest.Mixin],
  renderSSHKeys: function (sshKeys) {
    if (!sshKeys || !sshKeys.length) {
      return <p>No keys configured.</p>;
    }

    return (
      <ul className="row">
        {sshKeys.map(function (sshKey) {
          return (
            <li className="row__col row__col--6" key={sshKey.name}>
              <div className="ssh-key">
                <h3 className="ssh-key__name">{sshKey.name}</h3>
                <pre className="ssh-key__code"><code className="code--block">{sshKey.key}</code></pre>
              </div>
            </li>
          );
        })}
      </ul>
    );
  },
  render: function () {
    var self = this;
    if (!self.props.user) {
      return;
    }

    return (
      <div className="user">
        <h2>SSH Keys</h2>
        {this.renderSSHKeys(self.props.user.sshKeys)}
      </div>
    );
  }
});

module.exports = User;
