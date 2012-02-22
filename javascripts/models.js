(function() {
  var CR,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  CR = "10.001025 -84.134588";

  this.AppData = (function(_super) {

    __extends(AppData, _super);

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

  })(Backbone.Model);

  this.Place = (function(_super) {

    __extends(Place, _super);

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

  })(Backbone.Model);

  this.Places = (function(_super) {

    __extends(Places, _super);

    function Places() {
      Places.__super__.constructor.apply(this, arguments);
    }

    Places.prototype.model = Place;

    Places.prototype.parse = function(resp, xhr) {
      return resp.objects;
    };

    Places.prototype.show = function() {
      var _this = this;
      this.trigger('show');
      return this.each(function(place) {
        return place.trigger('show');
      });
    };

    Places.prototype.hide = function() {
      var _this = this;
      this.trigger('hide');
      return this.each(function(place) {
        return place.trigger('hide');
      });
    };

    return Places;

  })(Backbone.Collection);

  this.PlaceType = (function(_super) {

    __extends(PlaceType, _super);

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

  })(Backbone.Model);

  this.PlaceTypes = (function(_super) {

    __extends(PlaceTypes, _super);

    function PlaceTypes() {
      PlaceTypes.__super__.constructor.apply(this, arguments);
    }

    PlaceTypes.prototype.model = PlaceType;

    return PlaceTypes;

  })(Backbone.Collection);

}).call(this);
