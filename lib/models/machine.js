var Machine = function (data) {
  var self = this;

  self.computeNode = data.compute_node;
  self.id = data.id;
  self.ips = data.ips;
  self.name = data.name;
  self.state = data.state;
  self.dataCenter = data.dataCenter;
  self.up = data.up;

  if (data.state === 'running') {
    data.audit.some(function (data) {
      if (['reboot', 'start', 'provision'].indexOf(data.action) !== -1) {
        self.up = data.time;
        return true;
      }

      return false;
    });
  }

  self.os = data.image.os;
}

module.exports = Machine;
