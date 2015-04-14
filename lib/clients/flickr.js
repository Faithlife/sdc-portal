/**
 * TODO: Description.
 */
var util = require('util');
var ProxyClient = require('proxy-client');

/**
 * Creates a new instance of FlickrClient with the provided `options`.
 *
 * @param {Object} options
 */
function FlickrClient(options) {
  if (!(this instanceof FlickrClient)) {
    return new FlickrClient(options);
  }

  options = options || {};

  this.apiKey = this.apiKey || options.apiKey;
  this.rootUrl = this.rootUrl || options.rootUrl || 'https://api.flickr.com/services/rest';

  ProxyClient.call(this, options);
}
ProxyClient.inherit(FlickrClient);

/**
 * Makes a request to the Flickr API in their non-standard way.
 */
FlickrClient.prototype.call = function call(method, args) {
  return this.get('/')
    .query(util._extend({
      method: method,
      api_key: this.apiKey,
      format: 'json',
      nojsoncallback: 1
    }, args))
    .end();
};

/**
 * Returns an Array of "interesting" Photo objects for today.
 * Pagination is supported via `page` and `count`.
 */
FlickrClient.prototype.getInteresting = function getInteresting(params) {
  var self = this;

  params = params || {};

  return self
    .call('flickr.interestingness.getList', {
      per_page: params.count,
      page: params.page
    })
    .then(function (response) {
      if (response.status !== 200) {
        return self.rejectResponse(response);
      }

      return response.body.photos.photo;
    });
};

/*!
 * Export `FlickrClient`.
 */
module.exports = FlickrClient;
