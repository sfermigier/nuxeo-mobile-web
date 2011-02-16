(function() {
  var BaseView, DocumentModel, DocumentView, HelpView, HomeView, NuxeoController, ROOT, TimelineDocument, TimelineView, app, debug;
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
  console.log("Root = " + ROOT);
  debug = function(y, x) {
    return console.log(y + ": " + JSON.stringify(x) + "\n");
  };
  app = {
    activePage: function() {
      return $(".ui-page-active");
    },
    reapplyStyles: function(el) {
      el.find('ul[data-role]').listview();
      el.find('div[data-role="fieldcontain"]').fieldcontain();
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
  console.log("location: " + this.location.href);
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
      this.title = "Timeline";
      this.children = response;
      return this.isfolder = true;
    };
    return TimelineDocument;
  })();
  BaseView = (function() {
    function BaseView() {
      this.render_file = __bind(this.render_file, this);;
      this.render_folder = __bind(this.render_folder, this);;
      this.render = __bind(this.render, this);;      BaseView.__super__.constructor.apply(this, arguments);
    }
    __extends(BaseView, Backbone.View);
    BaseView.prototype.render = function() {
      var model;
      if (this.model.children) {
        model = this.model;
      } else {
        model = {
          children: this.model.get('children'),
          title: this.model.get('title'),
          isfolder: this.model.get('isfolder'),
          oid: this.model.oid
        };
      }
      debug("model", model);
      if (model.isfolder) {
        return this.render_folder(model);
      } else {
        return this.render_file(model);
      }
    };
    BaseView.prototype.render_folder = function(model) {
      var child, content, template, _i, _len, _ref;
      template = this.template || this.list_template;
      _ref = model.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.icon = getIconName(child);
        console.log(child.icon);
      }
      content = Mustache.to_html(template, model);
      this.el.find('.ui-content').html(content);
      this.el.find('h1').html(this.model.title);
      return app.reapplyStyles(this.el);
    };
    BaseView.prototype.render_file = function(model) {
      var content, template;
      template = this.template || this.metadata_template;
      content = Mustache.to_html(template, model);
      this.el.find('.ui-content').html(content);
      this.el.find('h1').html(this.model.title);
      return app.reapplyStyles(this.el);
    };
    return BaseView;
  })();
  DocumentView = (function() {
    __extends(DocumentView, BaseView);
    function DocumentView(oid) {
      DocumentView.__super__.constructor.apply(this, arguments);
      this.model = new DocumentModel(oid);
      this.el = app.activePage();
      this.metadata_template = '<div>\n\n<p>Title: {{title}}</p>\n<p>Path: {{path}}</p>\n<p>Created: {{created}}</p>\n<p>Modified: {{modified}}</p>\n\n<p><a href="">View</a></p>\n\n</div>';
      this.list_template = '<div>\n\n<ul data-role="listview" data-theme="c">\n  {{#children}}\n    <li class="ui-li ui-li-has-icon ui-btn ui-icon-right" >\n    <a href="#doc-{{oid}}">\n    <img src="icons/{{icon}}" class="ui-li-icon"/>\n    {{title}}\n    {{#childcount}}<span class="ui-li-count"> {{childcount}}</span>{{/childcount}}\n    </a>\n    </li>\n  {{/children}}\n</ul>\n\n</div>';
      this.model.fetch();
      this.model.bind('change', this.render);
    }
    return DocumentView;
  })();
  TimelineView = (function() {
    __extends(TimelineView, BaseView);
    function TimelineView() {
      TimelineView.__super__.constructor.apply(this, arguments);
      this.model = new TimelineDocument;
      this.el = app.activePage();
      this.template = '<div>\n\n<ul data-role="listview" data-theme="c" data-filter="true">\n  {{#children}}\n    <li><a href="#doc-{{oid}}">{{title}}</a><br>\n    toto titi\n    </li>\n  {{/children}}\n</ul>\n\n</div>';
      this.model.fetch();
      this.model.bind('change', this.render);
    }
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
    return NuxeoController;
  })();
  app.nuxeoController = new NuxeoController();
  $(document).ready(function() {
    Backbone.history.start();
    return app.nuxeoController.home();
  });
  this.app = app;
}).call(this);
