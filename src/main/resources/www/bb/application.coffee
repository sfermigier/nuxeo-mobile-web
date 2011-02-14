
#
# Some helper methods
#

if @location.port == "9998"
  ROOT = @location.origin + "/m/j/"
else
  ROOT = @location.origin + "/nuxeo/site/m/j/"

console.log("Root = " + ROOT)

debug = (y, x) -> console.log(y + ": " + JSON.stringify(x) + "\n")

app =
  activePage: ->
    $(".ui-page-active")
    
  reapplyStyles: (el) ->
    el.find('ul[data-role]').listview();
    el.find('div[data-role="fieldcontain"]').fieldcontain();
    el.find('button[data-role="button"]').button();
    el.find('input,textarea').textinput();
    el.page()
    
  redirectTo: (page) ->
    $.mobile.changePage page
  
  goBack: ->
    $.historyBack()
      

console.log("location: " + @location.href);

#
# Document class
#

class Document extends Backbone.Model
  constructor: (oid) ->
    super()
    @oid = oid

  url: ->
    if @oid
      ROOT + "i/" + @oid
    else
      ROOT + "i/"


class TimelineDocument extends Backbone.Model
  url : ROOT + "updates"

  parse: (response) ->
    @title = "Timeline"
    @children = response
    @isfolder = true


#
# Views
#

class BaseView extends Backbone.View
  render: =>
    if @model.children
      model = @model
    else
      model = {
        children: @model.get('children')
        title: @model.get('title')
        isfolder: @model.get('isfolder')
        oid: @model.oid
      }
    debug("model", model)

    if model.isfolder
      for child in model.children
        child.icon = getIconName(child)
        console.log(child.icon)
      content = Mustache.to_html(@template, model)
      @el.find('.ui-content').html(content)
      @el.find('h1').html(@model.title)
      # A hacky way of reapplying the jquery mobile styles
      app.reapplyStyles(@el)
    else
      url = ROOT + 'd/' + model.oid
      console.log(url)
      window.location.href = url


class DocumentView extends BaseView
  constructor: (oid) ->
    super
    @model = new Document(oid)
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
          <!--div class="ui-li-desc">{{created}}</div-->
          </a>
          </li>
        {{/children}}
      </ul>

      </div>
    '''

    @model.fetch()
    @model.bind 'change', @render


class TimelineView extends BaseView
  constructor: ->
    super
    @model = new TimelineDocument
    @el = app.activePage()
    @template = '''
      <div>

      <ul data-role="listview" data-theme="c" data-filter="true">
        {{#children}}
          <li><a href="#doc-{{oid}}">{{title}}</a><br>
          toto titi
          </li>
        {{/children}}
      </ul>

      </div>
    '''

    @model.fetch()
    @model.bind 'change', @render

#
# Home View
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

#
# Our only controller 
#

class NuxeoController extends Backbone.Controller
  routes :
    #"venues-:cid-edit" : "edit"
    #"venues-:cid" : "show"
    "home" : "home"
    "timeline": "timeline"
    "doc": "doc"
    "doc-:oid" : "doc"

  constructor: ->
    super
    @_views = {}

  home: ->
    @_views['home'] ||= new HomeView

  timeline: ->
    @_views['timeline'] ||= new TimelineView

  doc: (oid) ->
    view_name = "doc-" + oid
    console.log(view_name)
    @_views[view_name] ||= new DocumentView(oid)


app.nuxeoController = new NuxeoController()

#
# Start the app
#

$(document).ready ->
  Backbone.history.start()
  app.nuxeoController.home()

@app = app
