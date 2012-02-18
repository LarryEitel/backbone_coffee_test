

# VIEWS
# A PlaceView represents a single place on the map.
class PlaceView extends Backbone.View
    # Template for read-only display of place details in infoWindow.
    template: _.template """
        <div class='place-content'>
            <div class='place-header'>
                <span class='id'>{{ id }}</span>
            </div>
        </div>
        """

    # Actions that URLs are allowed to trigger.
    validActions: ['open', 'close']

    initialize: ->
        @map = @options.map
        @infoWindow = @options.infoWindow
        @maxWidth = 350
        @zoomLevel = 12

        # Respond to 'change' events from the model by re-rendering the view.
        @model.bind 'change', @render

        position = new google.maps.LatLng(parseFloat @model.get("lat"),
                                          parseFloat @model.get("lng"))
        
        #Create a new Google Maps place for this memory.
        @place = new google.maps.Place
            position: position
            map: @map


    # Open an infoWindow
    openInfoWindow: ->
        maxWidth = @maxWidth

        # Google's API requires .close() to set new max-width.
        @infoWindow.close
        @infoWindow.setOptions
            maxWidth: maxWidth
        @infoWindow.open @map, @place

    # ACTIONS
   
    # Pan to the place, open read-only infoWindow.
    open: ->
        @map.panTo @place.getPosition()
        if @map.getZoom() < @zoomLevel
            @map.setZoom @zoomLevel


    # Close the infoWindow.
    close: ->
        # TODO: Google already provides a close button. Do we need another?
        console.log "Debug: Info window closed"
