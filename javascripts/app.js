(function() {
  var MapView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  MapView = (function(_super) {

    __extends(MapView, _super);

    function MapView(center, zoom) {
      this.map = null;
      this.model = null;
      this.center = center;
      this.zoom = zoom;
      this.markers = [];
      MapView.__super__.constructor.call(this, "MapView");
    }

    MapView.prototype.initialize = function() {
      var defaults;
      this.appData = new AppData();
      this.map = null;
      if (this.zoom === 0) this.zoom = this.appData.get("zoom");
      if (this.center === "") {
        this.center = this.appData.get("center").split(",");
      } else {
        this.center = this.center.split(",");
      }
      defaults = {
        mapId: "map-canvas",
        center: this.center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: this.zoom
      };
      this.options = $.extend(defaults, this.options);
      this.initMap();
      return this.addmarker();
    };

    MapView.prototype.addmarker = function() {
      var center, marker;
      center = new google.maps.LatLng(this.options.center[0], this.options.center[1]);
      marker = new google.maps.Marker({
        position: center,
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: center.lat() + "," + center.lng()
      });
      google.maps.event.addListener(marker, "dragend", function(event) {
        return $.post("/places/post_test/", {
          id: 660,
          lat: marker.position.Pa,
          lng: marker.position.Qa
        }, function(data) {
          return $('body').append("Successfully posted to the page.");
        });
      });
      this.markers.push(marker);
      this.map.setCenter(center);
      return this;
    };

    MapView.prototype.initMap = function() {
      var mapEl, mapOptions;
      mapOptions = {
        zoom: this.options.zoom,
        center: new google.maps.LatLng(this.options.center[0], this.options.center[1]),
        mapTypeId: this.options.mapTypeId
      };
      mapEl = document.getElementById(this.options.mapId);
      return this.map = new google.maps.Map(mapEl, mapOptions);
    };

    return MapView;

  })(Backbone.View);

  window.MapView = MapView;

}).call(this);
