var littlest = require('littlest-isomorph');
var React = require('react');

var UploadKeyModal = React.createClass({
  mixins: [littlest.Mixin],
  getInitialState: function () {
    return {
      errorMessage: null
    };
  },
  uploadKey: function () {
    var self = this;

    var name = self.refs.keyName.getDOMNode().value;
    var key = self.refs.publicKey.getDOMNode().value;

    if (!key) {
      self.setState({
        errorMessage: "Public key is required!"
      });

      return;
    }

    self.context.performAction('user:sshkey:create', {
      userId: self.props.user.login,
      dataCenter: self.props.dataCenter,
      name: name,
      key: key
    });

    self.props.closeModal();
  },
  render: function () {
    var self = this;

    return (
      <div>
        <div className="modal__background" onClick={self.props.closeModal}>
        </div>
        <div className="modal">
          <div className="modal__header">
            <h2>Upload Key</h2>
          </div>
          <div className="modal__body">
            <div className="modal__field">
              <label htmlFor="keyName">Key name</label>
              <input className="modal__input" type="text" ref="keyName" name="keyName" maxLength="50" />
            </div>
            <div className="modal__field">
              <label htmlFor="publicKey">Public key</label>
              <textarea className="modal__input" ref="publicKey" name="publicKey" />
            </div>
          </div>
          <div className="modal__footer">
            <span className="modal__error">{self.state.errorMessage}</span>
            <button className="modal__action modal__action--close" onClick={self.props.closeModal}>Cancel</button>
            <button className="modal__action modal__action--submit" onClick={self.uploadKey}>Upload</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = UploadKeyModal;
