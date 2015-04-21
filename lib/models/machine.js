function Machine(data) {
  var self = this;

  self.computeNode = data.compute_node;
  self.id = data.id;
  self.ips = data.ips;
  self.name = data.name;
  self.state = data.state;
  self.dataCenter = data.dataCenter;
  self.up = data.up;

  if (data.state === 'running') {
    data.audit.some(function (record) {
      if (['reboot', 'start', 'provision'].indexOf(record.action) !== -1) {
        self.up = record.time;
        return true;
      }

      return false;
    });
  }

  self.os = data.image.os;
}

module.exports = Machine;
