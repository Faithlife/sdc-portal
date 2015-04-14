var ProxyClient = require('proxy-client');
var context = require('../context');
var client = new ProxyClient({ rootUrl: '/api' })

context.createAction('machine:machines:get', function (params) {
    return client
      .get('/machines?user=' + params.user)
      .end()
      .then(function (response) {
        return response.body.machines;
      });
});
