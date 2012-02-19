(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  this.MapView = (function(_super) {

    __extends(MapView, _super);

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
      var _this = this;
      this.map = new google.maps.Map(this.$('#map-canvas').get(0), {
        zoom: this.model.get('zoom'),
        center: new google.maps.LatLng(this.model.get('centerLat'), this.model.get('centerLng')),
        mapTypeId: this.model.get('mapTypeId')
      });
      google.maps.event.addListener(this.map, "click", function(event) {
        console.log(event.latLng);
        window.placeTypes.models[0].places.add({
          id: 3,
          point: 'POINT (10.001 -84.134)'
        });
        debugger;
      });
      this.collection.each(function(placeType) {
        return new PlaceTypeView({
          model: placeType,
          collection: placeType.places,
          map: _this.map
        });
      });
      return this.$('input[type="checkbox"]:checked').each(function(index, el) {
        var model;
        model = _this.collection.get($(el).val());
        return model.show();
      });
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

  })(Backbone.View);

  this.PlaceTypeView = (function(_super) {

    __extends(PlaceTypeView, _super);

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

  })(Backbone.View);

  this.PlacesView = (function(_super) {

    __extends(PlacesView, _super);

    function PlacesView() {
      this.render = __bind(this.render, this);
      PlacesView.__super__.constructor.apply(this, arguments);
    }

    PlacesView.prototype.initialize = function() {
      this.map = this.options.map;
      this.placeItemViews = [];
      this.collection.bind('reset', this.render);
      if (this.collection.length > 0) return this.render();
    };

    PlacesView.prototype.render = function() {
      var _this = this;
      _.each(this.placeItemViews, function(placeItemView) {
        return placeItemView.hide();
      });
      return this.collection.each(function(place) {
        return _this.placeItemViews.push(new PlaceItemView({
          model: place,
          map: _this.map
        }));
      });
    };

    return PlacesView;

  })(Backbone.View);

  this.PlaceItemView = (function(_super) {

    __extends(PlaceItemView, _super);

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
      var _this = this;
      this.position = new google.maps.LatLng(this.model.get('lat'), this.model.get('lng'));
      this.marker = new google.maps.Marker({
        position: this.position,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: this.position.lat() + "," + this.position.lng()
      });
      google.maps.event.addListener(this.marker, "dragend", function() {
        return _this.dragend();
      });
      return this.show();
    };

    PlaceItemView.prototype.dragend = function() {
      console.log('PlaceItemView#dragend');
      return this.model.set({
        lat: this.marker.position.Pa,
        lng: this.marker.position.Qa
      });
    };

    PlaceItemView.prototype.show = function() {
      return this.marker.setMap(this.map);
    };

    PlaceItemView.prototype.hide = function() {
      return this.marker.setMap(null);
    };

    return PlaceItemView;

  })(Backbone.View);

}).call(this);
