var context = require('../context');

context.createAction('photos:interesting:fetch', function (params) {
  return this.flickr.getInteresting();
});
