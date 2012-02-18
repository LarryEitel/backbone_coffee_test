(function() {
  var MapView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  MapView = (function(_super) {

    __extends(MapView, _super);

    function MapView() {
      this.markPlaces = __bind(this.markPlaces, this);
      MapView.__super__.constructor.apply(this, arguments);
    }

    MapView.prototype.initialize = function() {
      var defaults,
        _this = this;
      this.markers = [];
      this.map = null;
      this.places = new Places();
      this.places.bind("reset", this.markPlaces);
      defaults = {
        mapId: "map-canvas",
        center: this.model.get('center'),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: this.model.get('zoom')
      };
      this.options = $.extend(defaults, this.options);
      this.initMap();
      this.addmarker();
      this.addmarkers();
      return $.getJSON("/places.json", function(data) {
        if (data.objects != null) return _this.places.reset(data.objects);
      });
    };

    MapView.prototype.addmarkers = function() {
      var center, ll, marker;
      ll = this.model.get('center').split(',');
      center = new google.maps.LatLng(ll[0], ll[1]);
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
      return this.map.setCenter(center);
    };

    MapView.prototype.addmarker = function() {
      var center, ll, marker;
      ll = this.model.get('center').split(',');
      center = new google.maps.LatLng(ll[0], ll[1]);
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
      return this.map.setCenter(center);
    };

    MapView.prototype.initMap = function() {
      var mapEl, mapOptions;
      mapOptions = {
        zoom: this.options.zoom,
        center: new google.maps.LatLng(this.model.get('center')[0], this.model.get('center')[1]),
        mapTypeId: this.options.mapTypeId
      };
      mapEl = document.getElementById(this.options.mapId);
      return this.map = new google.maps.Map(mapEl, mapOptions);
    };

    MapView.prototype.markPlaces = function(places) {
      var _this = this;
      return places.each(function(place) {
        return console.log(place.id, place.get('lat'), place.get('lng'));
      });
    };

    return MapView;

  })(Backbone.View);

  window.MapView = MapView;

}).call(this);
