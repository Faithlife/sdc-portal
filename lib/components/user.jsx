var littlest = require('littlest-isomorph');
var React = require('react');
var UploadKeyModal = require('./uploadKeyModal.jsx');

var User = React.createClass({
  mixins: [littlest.Mixin],
  getInitialState: function () {
    return {
      uploadKeyModal: null
    };
  },
  closeUploadKeyModal: function () {
    this.setState({
      uploadKeyModal: null
    });
  },
  openUploadKeyModal: function () {
    var self = this;

    // TODO: React.withContext is deprecated: https://github.com/facebook/react/blob/a411f3e0dcac3cada4ce0acf6603bbb8ff7024a6/src/core/ReactContext.js#L54
    React.withContext(self.context, function () {
      self.setState({
        uploadKeyModal: <UploadKeyModal closeModal={self.closeUploadKeyModal} user={self.props.user} dataCenter={self.props.dataCenter} />
      });
    });
  },
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
        <h2 className="ssh-key__title">SSH Keys</h2>
        <button className="ssh-key__action ssh-key__action--upload" onClick={self.openUploadKeyModal}>Upload Key</button>
        {self.renderSSHKeys(self.props.user.sshKeys)}
        {self.state.uploadKeyModal}
      </div>
    );
  }
});

module.exports = User;
