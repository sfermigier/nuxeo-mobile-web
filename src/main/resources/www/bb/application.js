(function() {
  var BaseView, Document, DocumentView, HomeView, NuxeoController, ROOT, TimelineDocument, TimelineView, app, debug;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  if (this.location.port === "9998") {
    ROOT = this.location.origin + "/m/j/";
  } else {
    ROOT = this.location.origin + "/nuxeo/site/m/j/";
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
  Document = (function() {
    __extends(Document, Backbone.Model);
    function Document(oid) {
      Document.__super__.constructor.call(this);
      this.oid = oid;
    }
    Document.prototype.url = function() {
      if (this.oid) {
        return ROOT + "i/" + this.oid;
      } else {
        return ROOT + "i/";
      }
    };
    return Document;
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
      this.render = __bind(this.render, this);;      BaseView.__super__.constructor.apply(this, arguments);
    }
    __extends(BaseView, Backbone.View);
    BaseView.prototype.render = function() {
      var child, content, model, url, _i, _len, _ref;
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
        _ref = model.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          child.icon = getIconName(child);
          console.log(child.icon);
        }
        content = Mustache.to_html(this.template, model);
        this.el.find('.ui-content').html(content);
        this.el.find('h1').html(this.model.title);
        return app.reapplyStyles(this.el);
      } else {
        url = ROOT + 'd/' + model.oid;
        console.log(url);
        return window.location.href = url;
      }
    };
    return BaseView;
  })();
  DocumentView = (function() {
    __extends(DocumentView, BaseView);
    function DocumentView(oid) {
      DocumentView.__super__.constructor.apply(this, arguments);
      this.model = new Document(oid);
      this.el = app.activePage();
      this.template = '<div>\n\n<ul data-role="listview" data-theme="c">\n  {{#children}}\n    <li class="ui-li ui-li-has-icon ui-btn ui-icon-right" >\n    <a href="#doc-{{oid}}">\n    <img src="icons/{{icon}}" class="ui-li-icon"/>\n    {{title}}\n    {{#childcount}}<span class="ui-li-count"> {{childcount}}</span>{{/childcount}}\n    <!--div class="ui-li-desc">{{created}}</div-->\n    </a>\n    </li>\n  {{/children}}\n</ul>\n\n</div>';
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
  NuxeoController = (function() {
    __extends(NuxeoController, Backbone.Controller);
    NuxeoController.prototype.routes = {
      "home": "home",
      "timeline": "timeline",
      "doc": "doc",
      "doc-:oid": "doc"
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
      console.log(view_name);
      return (_base = this._views)[view_name] || (_base[view_name] = new DocumentView(oid));
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
