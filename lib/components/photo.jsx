var util = require('util');
var React = require('react');
var SIZE_TO_TAG = {
  240: 'm',
  320: 'n',
  640: 'z',
  800: 'c',
  1024: 'b'
};
var SIZES = Object.keys(SIZE_TO_TAG).map(Number).sort();

var Home = React.createClass({
  propTypes: {
    photo: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      farm: React.PropTypes.number.isRequired,
      server: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired,
      secret: React.PropTypes.string.isRequired,
    }).isRequired
  },
  getDefaultProps: function () {
    return {
      photo: null
    };
  },
  getInitialState: function () {
    return {
      imgUrl: this.getBestImgUrl({ width: 0, height: 0 })
    };
  },
  componentDidMount: function () {
    this.setState({
      imgUrl: this.getBestImgUrl(this.getRealDimensions())
    });
  },
  getRealDimensions: function () {
    var rect = this.getDOMNode().getBoundingClientRect();
    var ratio = global.devicePixelRatio || 1;

    return {
      width: rect.width * ratio,
      height: rect.height * ratio,
    };
  },
  getTitle: function () {
    return this.props.photo.title;
  },
  getBestImgUrl: function (params) {
    var size = SIZES.reduce(function (best, width) {
      if (!best) {
        return width;
      }

      if (Math.abs(best - params.width) > Math.abs(width - params.width)) {
        return width;
      }

      return best;
    }, 0);

    return this.getUrlForSize(size);
  },
  getUrlForSize: function (size) {
    return util.format(
      'https://farm%s.staticflickr.com/%s/%s_%s_%s.jpg',
      this.props.photo.farm,
      this.props.photo.server,
      this.props.photo.id,
      this.props.photo.secret,
      SIZE_TO_TAG[size]
    );
  },
  render: function () {
    return (
      <div className="photo">
        <h2 className="photo__title">{this.getTitle()}</h2>
        <img className="photo__img" src={this.state.imgUrl} />
      </div>
    );
  }
});

module.exports = Home;
