(function() {
  var CR;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  CR = "10.001025 -84.134588";
  this.AppData = (function() {
    __extends(AppData, Backbone.Model);
    function AppData() {
      AppData.__super__.constructor.apply(this, arguments);
    }
    AppData.prototype.defaults = {
      center: CR,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    AppData.prototype.initialize = function(attributes) {
      var ll;
      ll = attributes.center.split(',');
      this.set('centerLat', ll[0]);
      return this.set('centerLng', ll[1]);
    };
    return AppData;
  })();
  this.Place = (function() {
    __extends(Place, Backbone.Model);
    function Place() {
      Place.__super__.constructor.apply(this, arguments);
    }
    Place.prototype.idAttribute = "id";
    Place.prototype.escapedJson = function() {
      var json;
      return json = {
        id: this.get("id")
      };
    };
    Place.prototype.initialize = function(attributes) {
      var match, _ref;
      match = (_ref = attributes.point) != null ? _ref.match(/(\-?\d+(?:\.\d+)?)\s(\-?\d+(?:\.\d+)?)/) : void 0;
      if (match != null) {
        this.set('lat', match[1]);
        return this.set('lng', match[2]);
      }
    };
    return Place;
  })();
  this.Places = (function() {
    __extends(Places, Backbone.Collection);
    function Places() {
      Places.__super__.constructor.apply(this, arguments);
    }
    Places.prototype.model = Place;
    Places.prototype.parse = function(resp, xhr) {
      return resp.objects;
    };
    Places.prototype.show = function() {
      this.trigger('show');
      return this.each(__bind(function(place) {
        return place.trigger('show');
      }, this));
    };
    Places.prototype.hide = function() {
      this.trigger('hide');
      return this.each(__bind(function(place) {
        return place.trigger('hide');
      }, this));
    };
    return Places;
  })();
  this.PlaceType = (function() {
    __extends(PlaceType, Backbone.Model);
    function PlaceType() {
      PlaceType.__super__.constructor.apply(this, arguments);
    }
    PlaceType.prototype.initialize = function() {
      this.places = new Places();
      return this.places.url = "/places/" + this.id + ".json";
    };
    PlaceType.prototype.show = function() {
      this.trigger('show');
      return this.places.show();
    };
    PlaceType.prototype.hide = function() {
      this.trigger('hide');
      return this.places.hide();
    };
    return PlaceType;
  })();
  this.PlaceTypes = (function() {
    __extends(PlaceTypes, Backbone.Collection);
    function PlaceTypes() {
      PlaceTypes.__super__.constructor.apply(this, arguments);
    }
    PlaceTypes.prototype.model = PlaceType;
    return PlaceTypes;
  })();
}).call(this);
