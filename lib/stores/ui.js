var context = require('../context');

context.createStore('ui')
  .define('activeUser', null)
  .define('activeDataCenter', null)
  .handle('ui:activeUser:select:succeeded', function (data) {
    this.activeUser = data;
  })
  .handle('ui:activeDataCenter:select:succeeded', function (data) {
    this.activeDataCenter = data;
  });
