/**
 * Machine is responsible for assembling and serializing a complete view of
 * SDC machine state from their myriad of available requests.
 */
var whenKeys = require('when/keys');
var ACTIVE_STATES = ['running', 'stopping', 'stopped'];
var START_ACTIONS = ['reboot', 'start', 'provision'];

/**
 * Creates a new instance of Machine from the provided `data`, which should
 * be a Machine record from SDC.
 *
 * See https://apidocs.joyent.com/cloudapi/#GetMachine for more information.
 */
function Machine(data) {
  if (!(this instanceof Machine)) {
    return new Machine(data)
  }

  this._machine = data;
  this._audit = null;
  this._image = null;
  this._dataCenter = null;
}
Machine.createMachine = Machine;

/**
 * Returns true if the Machine is in a state available for use by developers
 * on the Portal.
 */
Machine.prototype.isActive = function isActive() {
  return ACTIVE_STATES.indexOf(this._machine.state) !== -1;
}

/**
 * Returns a Promise to be fulfilled with the updated Machine once it has
 * loaded any extended data from `client`, which should be pre-configured with
 * the desired `user` and `dataCenter`.
 */
Machine.prototype.loadExtendedData = function loadExtendedData(client) {
  var self = this;

  return whenKeys.all({
    audit: client.getMachineAudit(self._machine.id),
    image: client.getImage(self._machine.image)
  })
    .then(function (data) {
      self._audit = data.audit;
      self._image = data.image;
      self._dataCenter = client.dataCenter;

      return self;
    });
};

/**
 * Returns an Object suitable to serialize as JSON.
 */
Machine.prototype.toJSON = function toJSON() {
  if (!this._machine) {
    return null;
  }

  return {
    computeNode: this._machine.compute_node,
    id: this._machine.id,
    ips: this._machine.ips,
    name: this._machine.name,
    state: this._machine.state,
    dataCenter: this._dataCenter,
    up: this._findStartDate(),
    os: this._image ? this._image.os : null
  };
};

/**
 * Returns a Date object representing the last time the Machine was started.
 * If the Machine is not running, it returns null.
 */
Machine.prototype._findStartDate = function _findStartDate() {
  var start = null;

  if (this.state !== 'running') {
    return start;
  }

  this._audit.some(function (record) {
    if (START_ACTIONS.indexOf(record.action) !== -1) {
      start = record.time;
      return true;
    }

    return false;
  });

  return start;
};

/*!
 * Export `Machine`.
 */
module.exports = Machine;
