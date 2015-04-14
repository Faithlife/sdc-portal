var ProxyClient = require('proxy-client');
var context = require('../context');
var client = new ProxyClient({ rootUrl: '/api' })

context.createAction('user:users', function (params) {
  return client
    .get('/users')
    .end()
    .then(function (response) {
      return response.body.users;
    });
});
