(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };
  this.MapView = (function() {
    __extends(MapView, Backbone.View);
    function MapView() {
      MapView.__super__.constructor.apply(this, arguments);
    }
    MapView.prototype.initialize = function() {
      return this.render();
    };
    MapView.prototype.render = function() {
      this.map = new google.maps.Map(this.el, {
        zoom: this.model.get('zoom'),
        center: new google.maps.LatLng(this.model.get('centerLat'), this.model.get('centerLng')),
        mapTypeId: this.model.get('mapTypeId')
      });
      return this.placesView = new PlacesView({
        collection: this.collection,
        map: this.map
      });
    };
    return MapView;
  })();
  this.PlacesView = (function() {
    __extends(PlacesView, Backbone.View);
    function PlacesView() {
      this.render = __bind(this.render, this);
      PlacesView.__super__.constructor.apply(this, arguments);
    }
    PlacesView.prototype.initialize = function() {
      this.map = this.options.map;
      this.collection.bind('reset', this.render);
      if (this.collection.length > 0) {
        return this.render();
      }
    };
    PlacesView.prototype.render = function() {
      return this.collection.each(__bind(function(place) {
        return new PlaceItemView({
          model: place,
          map: this.map
        });
      }, this));
    };
    return PlacesView;
  })();
  this.PlaceItemView = (function() {
    __extends(PlaceItemView, Backbone.View);
    function PlaceItemView() {
      PlaceItemView.__super__.constructor.apply(this, arguments);
    }
    PlaceItemView.prototype.initialize = function() {
      this.map = this.options.map;
      return this.render();
    };
    PlaceItemView.prototype.render = function() {
      var marker, position;
      position = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));
      return marker = new google.maps.Marker({
        position: position,
        map: this.map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: position.lat() + "," + position.lng()
      });
    };
    return PlaceItemView;
  })();
}).call(this);
