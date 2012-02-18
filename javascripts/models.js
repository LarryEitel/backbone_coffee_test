(function() {
  var CR;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  CR = "10.001025,-84.134588";
  this.AppData = (function() {
    __extends(AppData, Backbone.Model);
    function AppData() {
      AppData.__super__.constructor.apply(this, arguments);
    }
    AppData.prototype.defaults = {
      center: CR,
      zoom: 12
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
    return Places;
  })();
}).call(this);
