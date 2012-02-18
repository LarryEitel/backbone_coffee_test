_.templateSettings = interpolate: /\{\{(.+?)\}\}/g


class @MapView extends Backbone.View
  events:
    'click input[type="checkbox"]': '_togglePlaceType'

  initialize: ->
    @render()

  render: ->
    @map = new google.maps.Map @$('#map-canvas').get(0),
      zoom: @model.get('zoom')
      center: new google.maps.LatLng(@model.get('centerLat'), @model.get('centerLng'))
      mapTypeId: @model.get('mapTypeId')

    @collection.each (placeType) =>
      new PlaceTypeView(model: placeType, collection: placeType.places, map: @map)

    @$('input[type="checkbox"]:checked').each (index, el) =>
      model = @collection.get($(el).val())
      model.show()

  _togglePlaceType: (e) ->
    inputEl = @$(e.target)
    model = @collection.get(inputEl.val())
    if inputEl.is(":checked")
      model.show()
    else
      model.hide()

class @PlaceTypeView extends Backbone.View
  initialize: ->
    @map = @options.map
    @model.bind 'show', @show
    @model.bind 'hide', @hide
    @render()

  render: ->
    @placesView = new PlacesView(collection: @collection, map: @map)

  show: =>
    @collection.fetch()

  hide: =>

class @PlacesView extends Backbone.View
  initialize: ->
    @map = @options.map
    @placeItemViews = []
    @collection.bind 'reset', @render
    @render() if @collection.length > 0

  render: =>
    _.each @placeItemViews, (placeItemView) =>
      placeItemView.hide()
    @collection.each (place) =>
      @placeItemViews.push(new PlaceItemView(model: place, map: @map))

class @PlaceItemView extends Backbone.View
  initialize: ->
    @map = @options.map
    @model.bind 'show', @show
    @model.bind 'hide', @hide
    @render()

  render: ->
    @position = new google.maps.LatLng(@model.get('lat'), @model.get('lng'))
    @marker = new google.maps.Marker(
      position: @position
      draggable: true
      animation: google.maps.Animation.DROP
      title: @position.lat() + "," + @position.lng()
    )
    @show()

  show: =>
    @marker.setMap(@map)

  hide: =>
    @marker.setMap(null)
