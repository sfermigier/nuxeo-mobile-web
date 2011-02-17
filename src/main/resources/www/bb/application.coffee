#
# Some helper methods
#

if @location.port == "9998"
  ROOT = @location.origin + "/mobile/api/"
else
  ROOT = @location.origin + "/nuxeo/site/mobile/api/"

#console.log("Root = " + ROOT)

#debug = (y, x) -> console.log(y + ": " + JSON.stringify(x) + "\n")
debug = (y, x) ->

app =
  activePage: ->
    $(".ui-page-active")
    
  reapplyStyles: (el) ->
    el.find('ul[data-role]').listview();
    el.find('div[data-role="fieldcontain"]').fieldcontain();
    el.find('a[data-role="button"]').button();
    el.find('button[data-role="button"]').button();
    el.find('input,textarea').textinput();
    el.page()
    
  redirectTo: (page) ->
    $.mobile.changePage page
  
  goBack: ->
    $.historyBack()
      

#console.log("location: " + @location.href);

#
# Document class
#

class DocumentModel extends Backbone.Model
  constructor: (oid) ->
    super()
    @oid = oid

  url: ->
    if @oid
      ROOT + "info/" + @oid
    else
      ROOT + "info/"


class TimelineDocument extends Backbone.Model
  url: ROOT + "updates"

  parse: (response) ->
    @children = response


#
# Views
#

class DocumentView extends Backbone.View
  constructor: (oid) ->
    super
    @model = new DocumentModel(oid)
    @el = app.activePage()

    @metadata_template = '''
      <div data-role="content">
      <p>Title: {{title}}</p>
      <p>Path: {{path}}</p>
      <p>Created: {{created}}</p>
      <p>Modified: {{modified}}</p>

      <a href="{{download_url}}" rel="external" data-role="button">View document</a>
      </div>
    '''

    @list_template = '''
      <div>

      <ul data-role="listview" data-theme="c">
        {{#children}}
          <li class="ui-li ui-li-has-icon ui-btn ui-icon-right" >
          <a href="#doc-{{oid}}">
          <img src="icons/{{icon}}" class="ui-li-icon"/>
          {{title}}
          {{#childcount}}<span class="ui-li-count"> {{childcount}}</span>{{/childcount}}
          </a>
          </li>
        {{/children}}
      </ul>

      </div>
    '''

    @model.fetch()
    @model.bind 'change', @render

  render: =>
    if @model.get("isfolder")
      @render_folder()
    else
      @render_file()
    # A hacky way of reapplying the jquery mobile styles
    app.reapplyStyles(@el)

  render_folder: =>
    model = @model.toJSON()
    for child in model.children
      child.icon = getIconName(child)
      #console.log(child.icon)
    content = Mustache.to_html(@list_template, model)
    @el.find('.ui-content').html(content)
    @el.find('h1').html(model.title)

  render_file: =>
    model = @model.toJSON()
    debug("model", model)
    model.download_url = ROOT + 'download/' + model.oid
    content = Mustache.to_html(@metadata_template, model)
    @el.find('.ui-content').html(content)
    @el.find('h1').html(model.title)


class TimelineView extends Backbone.View
  constructor: ->
    super
    @el = app.activePage()
    @template = '''
      <div>

      <ul data-role="listview" data-theme="c">
        {{#children}}
          <li class="ui-li ui-li-has-icon ui-btn ui-icon-right" >
          <a href="#doc-{{oid}}">
          <img src="icons/{{icon}}" class="ui-li-icon"/>
          {{title}}
          {{#childcount}}<span class="ui-li-count"> {{childcount}}</span>{{/childcount}}
          </a>
          </li>
        {{/children}}
      </ul>

      </div>
    '''

    @model = new TimelineDocument
    @model.fetch()
    @model.bind 'change', @render

  render: =>
    for child in @model.children
      child.icon = getIconName(child)
    content = Mustache.to_html(@template, @model)
    @el.find('.ui-content').html(content)
    @el.find('h1').html("Recent updates")
    app.reapplyStyles(@el)

#
# Basic View
#

class HomeView extends Backbone.View
  constructor: ->
    super

    @el = app.activePage()

    @content = '''
      <div>

      <ul data-role="listview" data-theme="c">
        <li><a href="#timeline">Timeline</a></li>
        <li><a href="#doc">Browse</a></li>
        <li><a href="#search">Search</a></li>
        <li><a href="#help">Help</a></li>
      </ul>

      </div>
      '''
    @render()

  render: =>
    # Render the content
    @el.find('.ui-content').html(@content)
    # A hacky way of reapplying the jquery mobile styles
    app.reapplyStyles(@el)


class HelpView extends Backbone.View
  constructor: ->
    super

    @el = app.activePage()

    @content = '''
      <div>
        <h3>Help about this application</h3>
        <p>Nuxeo Mobile is a mobile client for the Nuxeo EP enterprise Content Management Platform.</p>
        <p>For more information about the Nuxeo EP platform, <a href="http://www.nuxeo.com/">Click Here</a></p>
      </div>
      '''
    @render()

  render: =>
    # Render the content
    @el.find('.ui-content').html(@content)
    # A hacky way of reapplying the jquery mobile styles
    app.reapplyStyles(@el)

#
# Our only controller 
#

class NuxeoController extends Backbone.Controller
  routes:
    "home": "home"
    "timeline": "timeline"
    "doc": "doc"
    "doc-:oid": "doc"
    "search": "search" # TODO
    "help": "help"


  constructor: ->
    super
    @_views = {}

  home: ->
    @_views['home'] ||= new HomeView

  timeline: ->
    @_views['timeline'] ||= new TimelineView

  doc: (oid) ->
    view_name = "doc-" + oid
    @_views[view_name] ||= new DocumentView(oid)

  help: ->
    @_views['help'] ||= new HelpView

  search: ->
    @_views['help'] ||= new HelpView

app.nuxeoController = new NuxeoController()

#
# Start the app
#

$(document).ready ->
  Backbone.history.start()
  app.nuxeoController.home()

@app = app
