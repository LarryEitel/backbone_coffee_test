(function() {
  var AppData, CR, Place,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  CR = "10.001025,-84.134588";

  AppData = Backbone.Model.extend({
    defaults: {
      center: CR,
      zoom: 12
    }
  });

  Place = (function(_super) {

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

    return Place;

  })(Backbone.Model);

  window.AppData = AppData;

}).call(this);
