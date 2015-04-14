var Machine = function (data) {
  this.computeNode = data.compute_node
  this.id = data.id
  this.ips = data.ips
  this.name = data.name;
  this.state = data.state;
  this.dataCenter = data.dataCenter;
}

module.exports = Machine;
