_.templateSettings = interpolate: /\{\{(.+?)\}\}/g


class MapView extends Backbone.View
  #constructor: (center, zoom) ->
    #@map = null
    #@model = null
    #@center = center
    #@zoom = zoom
    #@markers = []
    #super("MapView")

  initialize: ->
    #@appData = new AppData()
    @markers = []
    @map = null

    @places = new Places()
    @places.bind "reset", @markPlaces

    # if no zoom was passed, used AppData default zoom level
    #if @zoom == 0
      #@zoom = @model.get("zoom")

    #if @center == ""
      #@center = @model.get("center").split ","
    #else
      #@center = @center.split ","

    defaults =
      mapId: "map-canvas"
      # center: new google.maps.LatLng(@center[0], @center[1])
      center: @model.get('center')
      mapTypeId: google.maps.MapTypeId.ROADMAP
      zoom: @model.get('zoom')

    @options = $.extend defaults, @options
    
    # # Bind 'this' to this object in event callbacks.
    # _.bindAll @, "addAll", "addOne", "render", "remove"

    @initMap()
    @addmarker()

    $.getJSON "/places.json", (data) =>
      if data.objects?
        @places.reset(data.objects)

  addmarker: ->
    ll = @model.get('center').split(',')
    center = new google.maps.LatLng(ll[0], ll[1])

    marker = new google.maps.Marker(
      position: center
      map: @map
      draggable: true
      animation: google.maps.Animation.DROP
      title: center.lat() + "," + center.lng()
    )
    google.maps.event.addListener marker, "dragend", (event) -> 
        $.post "/places/post_test/", 
          id: 660
          lat: marker.position.Pa
          lng: marker.position.Qa
          (data) -> $('body').append "Successfully posted to the page."

    @markers.push marker
    @map.setCenter center

    this

  initMap: ->
    mapOptions =
      zoom: @options.zoom
      center: new google.maps.LatLng(@model.get('center')[0], @model.get('center')[1]) 
      mapTypeId: @options.mapTypeId
      # panControlOptions:
      #   position: google.maps.ControlPosition.RIGHT_TOP
      # zoomControlOptions:
      #   position: google.maps.ControlPosition.RIGHT_TOP

    mapEl = document.getElementById @options.mapId
    @map = new google.maps.Map mapEl, mapOptions

  markPlaces: (places) =>
    places.each (place) =>
      #match = place.get('point').match(/(\-?\d+(?:\.\d+)?)\s(\-?\d+(?:\.\d+)?)/)
      #lat = match[1]
      #lng = match[2]

      #re = re.compile(/(\d+(\.\d+)?)\s(\d+(\.\d+)?)/)
      #match = reobj.search(place,get('point'))
        #if match:
           #result = match.group("groupname")
        #else:
         #result = ""

      console.log place.id, place.get('lat'), place.get('lng')

window.MapView = MapView

