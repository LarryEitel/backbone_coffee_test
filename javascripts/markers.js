(function() {
  var PlaceView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PlaceView = (function(_super) {

    __extends(PlaceView, _super);

    function PlaceView() {
      PlaceView.__super__.constructor.apply(this, arguments);
    }

    PlaceView.prototype.template = _.template("<div class='place-content'>\n    <div class='place-header'>\n        <span class='id'>{{ id }}</span>\n    </div>\n</div>");

    PlaceView.prototype.validActions = ['open', 'close'];

    PlaceView.prototype.initialize = function() {
      var position;
      this.map = this.options.map;
      this.infoWindow = this.options.infoWindow;
      this.maxWidth = 350;
      this.zoomLevel = 12;
      this.model.bind('change', this.render);
      position = new google.maps.LatLng(parseFloat(this.model.get("lat"), parseFloat(this.model.get("lng"))));
      return this.place = new google.maps.Place({
        position: position,
        map: this.map
      });
    };

    PlaceView.prototype.openInfoWindow = function() {
      var maxWidth;
      maxWidth = this.maxWidth;
      this.infoWindow.close;
      this.infoWindow.setOptions({
        maxWidth: maxWidth
      });
      return this.infoWindow.open(this.map, this.place);
    };

    PlaceView.prototype.open = function() {
      this.map.panTo(this.place.getPosition());
      if (this.map.getZoom() < this.zoomLevel) {
        return this.map.setZoom(this.zoomLevel);
      }
    };

    PlaceView.prototype.close = function() {
      return console.log("Debug: Info window closed");
    };

    return PlaceView;

  })(Backbone.View);

}).call(this);
