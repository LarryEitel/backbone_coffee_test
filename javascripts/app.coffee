_.templateSettings = interpolate: /\{\{(.+?)\}\}/g


class MapView extends Backbone.View
  constructor: (center, zoom) ->
    @map = null
    @model = null
    @center = center
    @zoom = zoom
    @markers = []
    super("MapView")

  initialize: ->
    @appData = new AppData()
    @map = null

    # if no zoom was passed, used AppData default zoom level
    if @zoom == 0
      @zoom = @appData.get("zoom")

    if @center == ""
      @center = @appData.get("center").split ","
    else
      @center = @center.split ","

    defaults =
      mapId: "map-canvas"
      # center: new google.maps.LatLng(@center[0], @center[1])
      center: @center
      mapTypeId: google.maps.MapTypeId.ROADMAP
      zoom: @zoom

    @options = $.extend defaults, @options
    
    # # Bind 'this' to this object in event callbacks.
    # _.bindAll @, "addAll", "addOne", "render", "remove"

    @initMap()
    @addmarker()

  addmarker: ->
    center = new google.maps.LatLng(@options.center[0], @options.center[1])

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
      center: new google.maps.LatLng(@options.center[0], @options.center[1]) 
      mapTypeId: @options.mapTypeId
      # panControlOptions:
      #   position: google.maps.ControlPosition.RIGHT_TOP
      # zoomControlOptions:
      #   position: google.maps.ControlPosition.RIGHT_TOP

    mapEl = document.getElementById @options.mapId
    @map = new google.maps.Map mapEl, mapOptions


window.MapView = MapView

