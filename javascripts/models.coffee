
CR = "10.001025,-84.134588" # no space between

AppData = Backbone.Model.extend(defaults:
  center: CR # center lat lng
  zoom: 12 # zoom level
)

# A place has a location
class Place extends Backbone.Model
    idAttribute: "id"

    # Fear the XSS.
    escapedJson: ->
        return json =
            id: @get "id"


window.AppData = AppData