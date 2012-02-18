_.templateSettings = interpolate: /\{\{(.+?)\}\}/g


class @MapView extends Backbone.View
  initialize: ->
    @render()

  render: ->
    @map = new google.maps.Map @el,
      zoom: @model.get('zoom')
      center: new google.maps.LatLng(@model.get('centerLat'), @model.get('centerLng'))
      mapTypeId: @model.get('mapTypeId')
    @placesView = new PlacesView(collection: @collection, map: @map)

class @PlacesView extends Backbone.View
  initialize: ->
    @map = @options.map
    @collection.bind 'reset', @render
    @render() if @collection.length > 0

  render: =>
    @collection.each (place) =>
      new PlaceItemView(model: place, map: @map)

class @PlaceItemView extends Backbone.View
  initialize: ->
    @map = @options.map
    @render()

  render: ->
    position = new google.maps.LatLng(@model.get('lat'), @model.get('lng'))
    marker = new google.maps.Marker(
      position: position
      map: @map
      draggable: true
      animation: google.maps.Animation.DROP
      title: position.lat() + "," + position.lng()
    )

