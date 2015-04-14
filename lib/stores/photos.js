var context = require('../context');

context.createStore('photos')
  .define('interesting', [])
  .handle('photos:interesting:fetch:succeeded', function (data) {
    this.interesting = data;
  });
