
CR = "10.001025,-84.134588" # no space between

#@AppData = Backbone.Model.extend(defaults:
  #center: CR # center lat lng
  #zoom: 12 # zoom level
#)

class @AppData extends Backbone.Model
  defaults:
    center: CR
    zoom: 12

# A place has a location
class @Place extends Backbone.Model
    idAttribute: "id"

    # Fear the XSS.
    escapedJson: ->
        return json =
            id: @get "id"

    initialize: (attributes) ->
      match = attributes.point?.match(/(\-?\d+(?:\.\d+)?)\s(\-?\d+(?:\.\d+)?)/)
      if match?
        @set('lat', match[1])
        @set('lng', match[2])

class @Places extends Backbone.Collection
  model: Place
