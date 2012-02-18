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
    MapView.prototype.events = {
      'click input[type="checkbox"]': '_togglePlaceType'
    };
    MapView.prototype.initialize = function() {
      return this.render();
    };
    MapView.prototype.render = function() {
      this.map = new google.maps.Map(this.$('#map-canvas').get(0), {
        zoom: this.model.get('zoom'),
        center: new google.maps.LatLng(this.model.get('centerLat'), this.model.get('centerLng')),
        mapTypeId: this.model.get('mapTypeId')
      });
      this.collection.each(__bind(function(placeType) {
        return new PlaceTypeView({
          model: placeType,
          collection: placeType.places,
          map: this.map
        });
      }, this));
      return this.$('input[type="checkbox"]:checked').each(__bind(function(index, el) {
        var model;
        model = this.collection.get($(el).val());
        return model.show();
      }, this));
    };
    MapView.prototype._togglePlaceType = function(e) {
      var inputEl, model;
      inputEl = this.$(e.target);
      model = this.collection.get(inputEl.val());
      if (inputEl.is(":checked")) {
        return model.show();
      } else {
        return model.hide();
      }
    };
    return MapView;
  })();
  this.PlaceTypeView = (function() {
    __extends(PlaceTypeView, Backbone.View);
    function PlaceTypeView() {
      this.hide = __bind(this.hide, this);
      this.show = __bind(this.show, this);
      PlaceTypeView.__super__.constructor.apply(this, arguments);
    }
    PlaceTypeView.prototype.initialize = function() {
      this.map = this.options.map;
      this.model.bind('show', this.show);
      this.model.bind('hide', this.hide);
      return this.render();
    };
    PlaceTypeView.prototype.render = function() {
      return this.placesView = new PlacesView({
        collection: this.collection,
        map: this.map
      });
    };
    PlaceTypeView.prototype.show = function() {
      return this.collection.fetch();
    };
    PlaceTypeView.prototype.hide = function() {};
    return PlaceTypeView;
  })();
  this.PlacesView = (function() {
    __extends(PlacesView, Backbone.View);
    function PlacesView() {
      this.render = __bind(this.render, this);
      PlacesView.__super__.constructor.apply(this, arguments);
    }
    PlacesView.prototype.initialize = function() {
      this.map = this.options.map;
      this.placeItemViews = [];
      this.collection.bind('reset', this.render);
      if (this.collection.length > 0) {
        return this.render();
      }
    };
    PlacesView.prototype.render = function() {
      _.each(this.placeItemViews, __bind(function(placeItemView) {
        return placeItemView.hide();
      }, this));
      return this.collection.each(__bind(function(place) {
        return this.placeItemViews.push(new PlaceItemView({
          model: place,
          map: this.map
        }));
      }, this));
    };
    return PlacesView;
  })();
  this.PlaceItemView = (function() {
    __extends(PlaceItemView, Backbone.View);
    function PlaceItemView() {
      this.hide = __bind(this.hide, this);
      this.show = __bind(this.show, this);
      PlaceItemView.__super__.constructor.apply(this, arguments);
    }
    PlaceItemView.prototype.initialize = function() {
      this.map = this.options.map;
      this.model.bind('show', this.show);
      this.model.bind('hide', this.hide);
      return this.render();
    };
    PlaceItemView.prototype.render = function() {
      this.position = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));
      this.marker = new google.maps.Marker({
        position: this.position,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: this.position.lat() + "," + this.position.lng()
      });
      return this.show();
    };
    PlaceItemView.prototype.show = function() {
      return this.marker.setMap(this.map);
    };
    PlaceItemView.prototype.hide = function() {
      return this.marker.setMap(null);
    };
    return PlaceItemView;
  })();
}).call(this);
