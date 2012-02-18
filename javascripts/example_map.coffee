###
This script generates a Google map populated with events given to
it by the server.
    
It uses Backbone.js to separate concerns betwen models, views and
controllers. Models are RESTful wrappers around server-side objects
persisted in MongoDB (at this time), and can POST back changes the
user makes to his or her content.
###

# Use Django-style HTML templating with Underscore.
_.templateSettings =
    interpolate: /\{\{(.+?)\}\}/g

# MODELS

# A memory has a location, a time, and a description.
class Memory extends Backbone.Model
    # For Mongo compatibility.
    idAttribute: "_id"

    # Fear the XSS.
    escapedJson: ->
        return json =
            title: @escape "title"
            author: @escape "author"
            date: @get "date"
            place: @escape "place"
            description: @escape "description"
            _id: @get "_id"

    # Strip a field of its HTML content and return. Tricky!
    getSafe: (fieldName) ->
        tmp = document.createElement "DIV"
        tmp.innerHTML = @get fieldName
        return tmp.textContent or tmp.innerText

    # Get this model's date as a JavaScript Date object.
    getDate: ->
        new Date(Date.parse(@get("date")))


class MemoryList extends Backbone.Collection
    url: "/memories/memory"
    model: Memory


# VIEWS

# A MarkerView represents a single marker on the map.
class MarkerView extends Backbone.View
    # Template for read-only display of marker details in infoWindow.
    template: _.template """
        <div class='marker-content'>
            <div class='marker-header'>
                <span class='title'>{{ title }}</span>
                <span class='meta'>Added by {{ author }} on {{ date }}</span>
            </div>
            <div class='marker-place'><emphasis>{{ place }}</emphasis></div>
            <div class='marker-description'>{{ description }}</div>
            <a class='edit-marker' name='edit-marker' href='#markers/marker/edit/{{ _id }}'>Edit</a>
        </div>
        """

    # Template for editable display of marker details in infoWindow.
    editTemplate: _.template """
        <div class='marker-edit-form'>
            <form id='marker-edit'>
            <input id='title' name='title' type='text' value='{{ title }}' placeholder='Title'>
            <input id='place' name='place' type='text' value='{{ place }}' placeholder='Place'>
            <textarea id='description-{{ _id }}' name='description' rows=25 cols=45 placeholder='Description'>
                {{ description }}
            </textarea>
            <a class='save-button' name='save-button' href='#markers/marker/save/{{ _id }}'>Save</a>
            <a class='cancel-button' name='cancel-button' href='#markers/marker/cancel/{{ _id }}'>Cancel</a>
        </div>
        """

    # Actions that URLs are allowed to trigger.
    validActions: ['open', 'close', 'save', 'edit', 'cancel', 'toggle']

    initialize: ->
        @map = @options.map
        @infoWindow = @options.infoWindow
        @maxWidth = 350
        @zoomLevel = 12
        @editButton = null
        @editing = null
        @ckeditor = null

        # Bind 'this' to the view in all methods.
        _.bindAll @, "render", "edit", "open", "close", "save", "toggle",
                  "remove", "openInfoWindow", "readOnlyHtml", "editFormHtml",
                  "handleAction"

        # Respond to 'change' events from the model by re-rendering the view.
        @model.bind 'change', @render

        now = new Date()
        date = @model.getDate()
        position = new google.maps.LatLng(parseFloat @model.get("lat"),
                                          parseFloat @model.get("lon"))
        
        #Create a new Google Maps marker for this memory.
        @marker = new google.maps.Marker
            position: position
            map: @map
            zIndex: @zIndexByAge

        # Age in days. TODO: Used?
        @marker.age = (now.getTime() - date.getTime()) / 86400000

        # Show this marker's content when the user clicks its icon.
        google.maps.event.addListener @marker, "click", => @open()

        return this

    # Open an infoWindow on the map containing HTML content.
    openInfoWindow: (content) ->
        maxWidth = @maxWidth
        height = null
        if @editing or /\<img/.test content
            maxWidth = null

        # Google's API requires .close() to set new max-width.
        @infoWindow.close()
        @infoWindow.setOptions
            maxWidth: maxWidth
        @infoWindow.setContent content
        @infoWindow.open @map, @marker

        # When editing a form, add a CKeditor widget; otherwise destroy widget.
        clear = =>
            @clearEditor()
            @clearInfoWindowEvents()

        if @editing
            # Attach a WYSIWYG editor when the infoWidnow opens.
            google.maps.event.addListener @infoWindow, 'domready', => @addEditor()
        else
            # Clear any lingering events.
            clear()
        
        # Clear editor and events when infoWindow closes or content changes.
        google.maps.event.addListener @infoWindow, 'closeclick', -> clear()
        google.maps.event.addListener @infoWindow, 'content_changed', -> clear()

    # Create WYSIWYG editor for the infoWidnow.
    addEditor: ->
        if not @ckeditor?
            @ckeditor = CKEDITOR.replace 'description-' + @model.get("_id"),
                toolbar: [['Source', '-', 'Bold', 'Italic', 'Image', 'Link', 'Unlink']]

    # Remove WYSIWYG editor.
    clearEditor: ->
        if @ckeditor?
            CKEDITOR.remove @ckeditor
            @ckeditor = null

    clearInfoWindowEvents: ->
        google.maps.event.clearListeners @infoWindow, 'domready'
        google.maps.event.clearListeners @infoWindow, 'content_changed'
        google.maps.event.clearListeners @infoWindow, 'closeclick'

    # Replace the marker's infoWindow with read-only HTML.
    readOnlyHtml: ->
        return @template @model.toJSON()

    # Replace the marker's infoWindow with an edit form.
    editFormHtml: ->
        return @editTemplate @model.escapedJson()

    # Handle an action routed from the controller if the action is valid.
    handleAction: (action) ->
        if typeof @[action] is 'function' and _.indexOf @validActions, action isnt -1
            @[action]()

    # ACTIONS
   
    # Pan to the marker, open read-only infoWindow.
    open: ->
        @map.panTo @marker.getPosition()
        if @map.getZoom() < @zoomLevel
            @map.setZoom @zoomLevel
        @editing = false
        @openInfoWindow @readOnlyHtml()

    # Toggle template in open infoWindow to display editable fields.
    edit: ->
        @toggle()

    # Cancel editing, go back to read-only fields.
    cancel: ->
        @toggle()

    # Close the infoWindow.
    close: ->
        # TODO: Google already provides a close button. Do we need another?
        console.log "Debug: Info window closed"

    # Toggle infoWindow fields between read-only and editable.
    toggle: ->
        content = null
        # If the marker has never been opened, redirect and open.
        if not @editing?
            window.location = "#markers/marker/open/" + @model.get "_id"
            return
        if @editing
            content = @readOnlyHtml()
            @editing = false
        else
            content = @editFormHtml()
            @editing = true

        $(@el).html content
        @openInfoWindow content

    # Tell the model to persist its data to the server.
    save: ->
        # This won't work if we aren't on an edit form.
        if not @editing?
            return
        title = ($ "#title").val()
        place = ($ "#place").val()
        description = @ckeditor.getData()
        @model.set
            title: title,
            place: place,
            description: description
        @model.save()
        @toggle()

    # Remove the marker from the map. TODO: Unused at this time.
    remove: ->
        # Unregister marker events
        google.maps.event.clearInstanceListeners @marker
        # Set map to null, causing marker to be removed per API spec
        @marker.setMap null


# A view representing a Memory as a single item in a list.
class NavigationItemView extends Backbone.View
    template: _.template """
        <li>
            <h3><a href='#markers/marker/open/{{ id }}'>{{ title }}</a></h4>
            <p>{{ description }}</p>
        </li>
        """

    initialize: ->
        _.bindAll @, 'render'
        @model.bind 'change', @render

    # Add item to list of markers in sidebar
    render: ->
        maxDescLength = 150
        sliceEnd = maxDescLength
        date = @model.getDate()
        markerYear = date.getFullYear() # unused
        navigation = ($ "#navigation-items")j
        description = @model.getSafe "description"
        shortDescription = ""

        # First remove it if it already exists
        if @item?
            @remove()

        # Portion of the description to show in the navigation item.
        if description.length <= maxDescLength
            shortDescription = description
        else
            shortDescription = description.slice(0, maxDescLength) + " ..."

        @item = @template
            "title": @model.get "title"
            "id": @model.get "_id"
            "description": shortDescription
        @item = $(@item).appendTo navigation

    remove: ->
        $(@item).remove()


# A view representing a list of Memory objects that link to MarkerViews.
class NavigationView extends Backbone.View
    initialize: ->
        @itemViews= []
        @selectId = @options.selectId || "year"
        @year = @getSelectedYear()

        _.bindAll @, 'render', 'addOne', 'addAll', 'remove', 'getSelectedYear'
        
        @collection.bind 'add', @addOne
        @collection.bind 'refresh', @render

        # Set default options. 
        if not @id?
            @id = "navigation"

    addOne: (memory) ->
        view = new NavigationItemView
            model: memory
        @itemViews.push view

    addAll: (year) ->
        @collection.each (memory) =>
            if year is "Any" or memory.getDate().getFullYear().toString() is year
                @addOne memory

    render: ->
        if not @slider?
            @renderSlider()

        # Remove elements if they already exist.  
        @remove()

        # Add subviews for all visible models.
        @addAll @year
    
        # Render all subviews
        $.each @itemViews, -> @render()

    # TODO: No longer used. Need to refactor, add a real timeline widget.
    renderSlider: ->
        yearSelect = ($ "#"+@selectId)
        monthSelect = ($ "#month")

        yearSelect.change =>
            option = yearSelect.children("option:selected")
            #@slider.slider("value", option.index()+1)
            @yearChanged() # TODO: Is this called multiple times?

    # Rmove all subviews
    remove: ->
        if @itemViews
            $.each @itemViews, -> @remove()
            @itemViews = []

    # Get the currenlty selected year in the Year drop-down.
    getSelectedYear: ->
        option = ($ "#"+@selectId).children("option:selected")
        return option.val()

    # Notify listeners that the user selected a new year.
    yearChanged: ->
        year = @getSelectedYear()

        # Notify listeners of the currently selected year and render subviews.
        if not @year? or @year isnt year
            @year = year
            @render()
            @trigger "nav:yearChanged", year


# Main view for the app, a composite of other views.
class AppView extends Backbone.View
    initialize: ->
        @map = null
        @markerViews = []
        @navigationViews = []

        defaults =
            mapId: "map"
            infoWindowMaxWidth: 350
            center: new google.maps.LatLng 45.52, -122.68
            mapTypeId: google.maps.MapTypeId.TERRAIN
            defaultZoomLevel: 10

        @options = $.extend defaults, @options

        # Bind 'this' to this object in event callbacks.
        _.bindAll @, "addAll", "addOne", "render", "remove"

        @map = @initMap()
        @infoWindow = @initInfoWindow()

    sendActionToMarker: (action, id) ->
        markers = _.select @markerViews, (view) -> view.model.get("_id") is id
        if markers[0]
            markers[0].handleAction action

    initMap: ->
        mapOptions =
            zoom: @options.defaultZoomLevel
            center: @options.center
            mapTypeId: @options.mapTypeId
            panControlOptions:
                position: google.maps.ControlPosition.RIGHT_TOP
            zoomControlOptions:
                position: google.maps.ControlPosition.RIGHT_TOP

        # TODO: Add map events, if any
        mapEl = document.getElementById @options.mapId
        return new google.maps.Map mapEl, mapOptions

    initInfoWindow: ->
        infoWindow = new google.maps.InfoWindow
            maxWidth: @options.infoWindowMaxWidth

        # TODO: Add infoWindow events, if any
        return infoWindow

    addOne: (memory) ->
        @markerViews.push new MarkerView
            model: memory
            map: @map
            infoWindow: @infoWindow

    addAll: (year) ->
        @collection.each (memory) =>
            if year is "Any" or memory.getDate().getFullYear().toString() is year
                @addOne memory

    remove: ->
        @infoWindow.close()
        $.each @markerViews, => @remove()

    render: (year) ->
        @remove()
        @addAll year

        # Pan map to the most recent memory on the map 
        latestMemory = @markerViews[@markerViews.length-1]

        if latestMemory isnt undefined
            @map.panTo latestMemory.marker.getPosition()
        else
            # TODO: Handle the case where no markers are visible. 


# A controller that sends URL-based actions to the app.
class HomeController extends Backbone.Controller
    routes:
        "markers/marker/:action/:id": "sendActionToMarker"

    initialize: (options) ->
        _.bindAll @, "refresh", "sendActionToMarker", "filterMarkers"

        @memories = options.memories
        @memories.bind "refresh", @filterMarkers

        @appView = new AppView
            collection: @memories
        @navigationView = new NavigationView
            collection: @memories
        @navigationView.bind "nav:yearChanged", @filterMarkers

    sendActionToMarker: (action, id) ->
        @appView.sendActionToMarker action, id

    filterMarkers: ->
        @appView.render @navigationView.getSelectedYear()

    refresh: (newMemories) ->
        @memories.refresh newMemories
    
    getMapDiv: ->
        return @appView.map.getDiv()


# Make the HomeController and Memory list objects available globally,
# so we can pre-load them with JSON from the server rather than having
# to GET a collection of memories after rendering the map (less responsive).
window.HomeController = HomeController
window.MemoryList = MemoryList
