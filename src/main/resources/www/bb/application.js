(function() {
  var DocumentModel, DocumentView, HelpView, HomeView, NuxeoController, ROOT, TimelineDocument, TimelineView, app, debug;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  if (this.location.port === "9998") {
    ROOT = this.location.origin + "/mobile/api/";
  } else {
    ROOT = this.location.origin + "/nuxeo/site/mobile/api/";
  }
  debug = function(y, x) {};
  app = {
    activePage: function() {
      return $(".ui-page-active");
    },
    reapplyStyles: function(el) {
      el.find('ul[data-role]').listview();
      el.find('div[data-role="fieldcontain"]').fieldcontain();
      el.find('a[data-role="button"]').button();
      el.find('button[data-role="button"]').button();
      el.find('input,textarea').textinput();
      return el.page();
    },
    redirectTo: function(page) {
      return $.mobile.changePage(page);
    },
    goBack: function() {
      return $.historyBack();
    }
  };
  DocumentModel = (function() {
    __extends(DocumentModel, Backbone.Model);
    function DocumentModel(oid) {
      DocumentModel.__super__.constructor.call(this);
      this.oid = oid;
    }
    DocumentModel.prototype.url = function() {
      if (this.oid) {
        return ROOT + "info/" + this.oid;
      } else {
        return ROOT + "info/";
      }
    };
    return DocumentModel;
  })();
  TimelineDocument = (function() {
    function TimelineDocument() {
      TimelineDocument.__super__.constructor.apply(this, arguments);
    }
    __extends(TimelineDocument, Backbone.Model);
    TimelineDocument.prototype.url = ROOT + "updates";
    TimelineDocument.prototype.parse = function(response) {
      return this.children = response;
    };
    return TimelineDocument;
  })();
  DocumentView = (function() {
    __extends(DocumentView, Backbone.View);
    function DocumentView(oid) {
      this.render_file = __bind(this.render_file, this);;
      this.render_folder = __bind(this.render_folder, this);;
      this.render = __bind(this.render, this);;      DocumentView.__super__.constructor.apply(this, arguments);
      this.model = new DocumentModel(oid);
      this.el = app.activePage();
      this.metadata_template = '<div data-role="content">\n<p>Title: {{title}}</p>\n<p>Path: {{path}}</p>\n<p>Created: {{created}}</p>\n<p>Modified: {{modified}}</p>\n\n<a href="{{download_url}}" rel="external" data-role="button">View document</a>\n</div>';
      this.list_template = '<div>\n\n<ul data-role="listview" data-theme="c">\n  {{#children}}\n    <li class="ui-li ui-li-has-icon ui-btn ui-icon-right" >\n    <a href="#doc-{{oid}}">\n    <img src="icons/{{icon}}" class="ui-li-icon"/>\n    {{title}}\n    {{#childcount}}<span class="ui-li-count"> {{childcount}}</span>{{/childcount}}\n    </a>\n    </li>\n  {{/children}}\n</ul>\n\n</div>';
      this.model.fetch();
      this.model.bind('change', this.render);
    }
    DocumentView.prototype.render = function() {
      if (this.model.get("isfolder")) {
        this.render_folder();
      } else {
        this.render_file();
      }
      return app.reapplyStyles(this.el);
    };
    DocumentView.prototype.render_folder = function() {
      var child, content, model, _i, _len, _ref;
      model = this.model.toJSON();
      _ref = model.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.icon = getIconName(child);
      }
      content = Mustache.to_html(this.list_template, model);
      this.el.find('.ui-content').html(content);
      return this.el.find('h1').html(model.title);
    };
    DocumentView.prototype.render_file = function() {
      var content, model;
      model = this.model.toJSON();
      debug("model", model);
      model.download_url = ROOT + 'download/' + model.oid;
      content = Mustache.to_html(this.metadata_template, model);
      this.el.find('.ui-content').html(content);
      return this.el.find('h1').html(model.title);
    };
    return DocumentView;
  })();
  TimelineView = (function() {
    __extends(TimelineView, Backbone.View);
    function TimelineView() {
      this.render = __bind(this.render, this);;      TimelineView.__super__.constructor.apply(this, arguments);
      this.el = app.activePage();
      this.template = '<div>\n\n<ul data-role="listview" data-theme="c">\n  {{#children}}\n    <li class="ui-li ui-li-has-icon ui-btn ui-icon-right" >\n    <a href="#doc-{{oid}}">\n    <img src="icons/{{icon}}" class="ui-li-icon"/>\n    {{title}}\n    {{#childcount}}<span class="ui-li-count"> {{childcount}}</span>{{/childcount}}\n    </a>\n    </li>\n  {{/children}}\n</ul>\n\n</div>';
      this.model = new TimelineDocument;
      this.model.fetch();
      this.model.bind('change', this.render);
    }
    TimelineView.prototype.render = function() {
      var child, content, _i, _len, _ref;
      _ref = this.model.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.icon = getIconName(child);
      }
      content = Mustache.to_html(this.template, this.model);
      this.el.find('.ui-content').html(content);
      this.el.find('h1').html("Recent updates");
      return app.reapplyStyles(this.el);
    };
    return TimelineView;
  })();
  HomeView = (function() {
    __extends(HomeView, Backbone.View);
    function HomeView() {
      this.render = __bind(this.render, this);;      HomeView.__super__.constructor.apply(this, arguments);
      this.el = app.activePage();
      this.content = '<div>\n\n<ul data-role="listview" data-theme="c">\n  <li><a href="#timeline">Timeline</a></li>\n  <li><a href="#doc">Browse</a></li>\n  <li><a href="#search">Search</a></li>\n  <li><a href="#help">Help</a></li>\n</ul>\n\n</div>';
      this.render();
    }
    HomeView.prototype.render = function() {
      this.el.find('.ui-content').html(this.content);
      return app.reapplyStyles(this.el);
    };
    return HomeView;
  })();
  HelpView = (function() {
    __extends(HelpView, Backbone.View);
    function HelpView() {
      this.render = __bind(this.render, this);;      HelpView.__super__.constructor.apply(this, arguments);
      this.el = app.activePage();
      this.content = '<div>\n  <h3>Help about this application</h3>\n  <p>Nuxeo Mobile is a mobile client for the Nuxeo EP enterprise Content Management Platform.</p>\n  <p>For more information about the Nuxeo EP platform, <a href="http://www.nuxeo.com/">Click Here</a></p>\n</div>';
      this.render();
    }
    HelpView.prototype.render = function() {
      this.el.find('.ui-content').html(this.content);
      return app.reapplyStyles(this.el);
    };
    return HelpView;
  })();
  NuxeoController = (function() {
    __extends(NuxeoController, Backbone.Controller);
    NuxeoController.prototype.routes = {
      "home": "home",
      "timeline": "timeline",
      "doc": "doc",
      "doc-:oid": "doc",
      "search": "search",
      "help": "help"
    };
    function NuxeoController() {
      NuxeoController.__super__.constructor.apply(this, arguments);
      this._views = {};
    }
    NuxeoController.prototype.home = function() {
      var _base;
      return (_base = this._views)['home'] || (_base['home'] = new HomeView);
    };
    NuxeoController.prototype.timeline = function() {
      var _base;
      return (_base = this._views)['timeline'] || (_base['timeline'] = new TimelineView);
    };
    NuxeoController.prototype.doc = function(oid) {
      var view_name, _base;
      view_name = "doc-" + oid;
      return (_base = this._views)[view_name] || (_base[view_name] = new DocumentView(oid));
    };
    NuxeoController.prototype.help = function() {
      var _base;
      return (_base = this._views)['help'] || (_base['help'] = new HelpView);
    };
    NuxeoController.prototype.search = function() {
      var _base;
      return (_base = this._views)['help'] || (_base['help'] = new HelpView);
    };
    return NuxeoController;
  })();
  app.nuxeoController = new NuxeoController();
  $(document).ready(function() {
    Backbone.history.start();
    return app.nuxeoController.home();
  });
  this.app = app;
}).call(this);
