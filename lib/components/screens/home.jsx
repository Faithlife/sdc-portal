var littlest = require('littlest-isomorph');
var React = require('react');
var App = require('../app.jsx');
var Photo = require('../photo.jsx');

var Home = React.createClass({
  mixins: [littlest.Mixin],
  mappings: {
    photos: 'photos:interesting'
  },
  render: function () {
    return (
      <App>
        <h1>Today's Interestingness</h1>
        {this.state.photos.map(function (photo) {
          return <Photo photo={photo} key={photo.id} />
        })}
      </App>
    );
  }
});

module.exports = Home;
