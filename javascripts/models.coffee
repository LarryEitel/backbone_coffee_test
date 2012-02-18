
CR = "10.001025 -84.134588" # no space between

class @AppData extends Backbone.Model
  defaults:
    center: CR
    zoom: 16
    mapTypeId: google.maps.MapTypeId.ROADMAP

  initialize: (attributes) ->
    ll = attributes.center.split(',')
    @set('centerLat', ll[0])
    @set('centerLng', ll[1])

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

  parse: (resp, xhr) ->
    resp.objects
