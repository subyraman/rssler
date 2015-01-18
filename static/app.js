(function(angular) {
  var rssler;
  rssler = angular.module('rssler', ['ngRoute', 'ui.select', 'ngSanitize', 'ui.bootstrap']);
  rssler.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      controller: 'MainController',
      controllerAs: 'mainCtrl',
      templateUrl: '/static/templates/main.html'
    });
    return $locationProvider.html5Mode(true);
  });
  rssler.config(function(datepickerConfig, datepickerPopupConfig) {
    datepickerConfig.showWeeks = false;
    return datepickerPopupConfig.closeText = "Close";
  });
  _.mixin({
    replaceArray: function(oldArray, newArray) {
      oldArray.length = 0;
      oldArray.push.apply(oldArray, newArray);
      return oldArray;
    }
  });
  return _.mixin({
    uniqCollection: function(collection) {
      var uniqified;
      uniqified = _.uniq(collection, function(item, key, id) {
        return item.id;
      });
      return uniqified;
    }
  });
})(angular);

(function(angular) {
  var AdvancedSearchController;
  AdvancedSearchController = (function() {
    function AdvancedSearchController($modalInstance, feedService, categoryService, searchService) {
      this.$modalInstance = $modalInstance;
      this.feedService = feedService;
      this.categoryService = categoryService;
      this.searchService = searchService;
      this.categories = this.categoryService.categories;
      this.startOpened = false;
      this.endOpened = false;
      this.dateFormat = 'dd-MMMM-yyyy';
      this.searchData = {};
      this.feeds = _.uniqCollection(_.flatten(_.pluck(this.categoryService.categories, 'feeds')));
    }

    AdvancedSearchController.prototype.openStart = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      return this.startOpened = true;
    };

    AdvancedSearchController.prototype.openEnd = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      return this.endOpened = true;
    };

    AdvancedSearchController.prototype.search = function() {
      this.searchData.start_date = this.startDate ? this.startDate.getTime() : "";
      this.searchData.end_date = this.endDate ? this.endDate.getTime() : "";
      this.searchData.feed_ids = this.selectedFeeds ? _.pluck(this.selectedFeeds, 'id') : [];
      this.searchData.category_ids = this.selectedCategories ? _.pluck(this.selectedCategories, 'id') : [];
      return this.searchService.search(this.searchData).then((function(_this) {
        return function() {
          return _this.$modalInstance.close();
        };
      })(this));
    };

    AdvancedSearchController.prototype.close = function() {
      return this.$modalInstance.close();
    };

    return AdvancedSearchController;

  })();
  return angular.module('rssler').controller('AdvancedSearchController', ['$modalInstance', 'feedService', 'categoryService', 'searchService', AdvancedSearchController]);
})(angular);

(function(angular) {
  var ArticleController;
  ArticleController = (function() {
    function ArticleController(feedService) {
      this.feedService = feedService;
      this.currentArticle = this.feedService.currentArticle;
    }

    return ArticleController;

  })();
  return angular.module('rssler').controller('ArticleController', ['articleService', ArticleController]);
})(angular);

(function(angular) {
  var CategoryController;
  CategoryController = (function() {
    function CategoryController(categoryService) {
      this.categoryService = categoryService;
      this.categories = this.categoryService.categories;
      this.uncategorized = this.categoryService.uncategorized;
      this.categoryService.getCategories();
      this.hasCategories = this.categoryService.hasCategories.bind(this.categoryService);
    }

    CategoryController.prototype.toggle = function(category) {
      return category.expanded = !category.expanded;
    };

    return CategoryController;

  })();
  return angular.module('rssler').controller('CategoryController', ['categoryService', CategoryController]);
})(angular);

(function(angular) {
  var DeleteCategoryController;
  DeleteCategoryController = (function() {
    function DeleteCategoryController($modalInstance, feedService, categoryService, viewService) {
      this.$modalInstance = $modalInstance;
      this.feedService = feedService;
      this.categoryService = categoryService;
      this.viewService = viewService;
      this.category = this.viewService.currentView.data;
    }

    DeleteCategoryController.prototype.deleteCategory = function() {
      return this.categoryService.deleteCategory(this.category).then((function(_this) {
        return function() {
          _this.categoryService.getCategories();
          _this.feedService.getAllFeedArticles();
          return _this.$modalInstance.close();
        };
      })(this));
    };

    DeleteCategoryController.prototype.close = function() {
      return this.$modalInstance.close();
    };

    return DeleteCategoryController;

  })();
  return angular.module('rssler').controller('DeleteCategoryController', ['$modalInstance', 'feedService', 'categoryService', 'viewService', DeleteCategoryController]);
})(angular);

(function(angular) {
  var DeleteFeedController;
  DeleteFeedController = (function() {
    function DeleteFeedController($modalInstance, feedService, categoryService, viewService) {
      this.$modalInstance = $modalInstance;
      this.feedService = feedService;
      this.categoryService = categoryService;
      this.viewService = viewService;
      this.feed = this.viewService.currentView.data;
    }

    DeleteFeedController.prototype.deleteFeed = function() {
      return this.feedService.deleteFeed(this.feed).then((function(_this) {
        return function() {
          _this.categoryService.getCategories();
          _this.feedService.getAllFeedArticles();
          return _this.$modalInstance.close();
        };
      })(this));
    };

    DeleteFeedController.prototype.close = function() {
      return this.$modalInstance.close();
    };

    return DeleteFeedController;

  })();
  return angular.module('rssler').controller('DeleteFeedController', ['$modalInstance', 'feedService', 'categoryService', 'viewService', DeleteFeedController]);
})(angular);

(function(angular) {
  var EditCategoryController;
  EditCategoryController = (function() {
    function EditCategoryController($modalInstance, viewService, categoryService, feedService) {
      var categoryFeeds, selectedIds;
      this.$modalInstance = $modalInstance;
      this.viewService = viewService;
      this.categoryService = categoryService;
      this.feedService = feedService;
      this.categoryData = {
        title: this.viewService.currentView.data.title,
        id: this.viewService.currentView.data.id
      };
      this.feeds = _.uniqCollection(_.flatten(_.pluck(this.categoryService.categories, 'feeds')));
      categoryFeeds = _.find(this.categoryService.categories, (function(_this) {
        return function(category) {
          return category.id === _this.categoryData.id;
        };
      })(this)).feeds;
      selectedIds = _.pluck(categoryFeeds, 'id');
      this.selectedFeeds = _.where(this.feeds, function(feed) {
        return _.contains(selectedIds, feed.id);
      });
      this.alerts = [];
    }

    EditCategoryController.prototype.isValid = function() {
      var valid;
      valid = true;
      _.replaceArray(this.alerts, []);
      if (!this.categoryData.title) {
        this.alerts.push({
          'msg': "Please select a title.",
          'type': 'danger'
        });
        valid = false;
      }
      if (this.categoryService.categoryExists(this.categoryData.title, this.categoryData.id)) {
        this.alerts.push({
          'msg': "" + this.categoryData.title + " already exists in database.",
          'type': 'danger'
        });
        valid = false;
      }
      if (!this.selectedFeeds.length) {
        this.alerts.push({
          'msg': "Please select at least one feed.",
          'type': 'danger'
        });
        valid = false;
      }
      return valid;
    };

    EditCategoryController.prototype.editCategory = function() {
      var feedIds;
      feedIds = _.pluck(this.selectedFeeds, 'id');
      this.categoryData.feedIds = feedIds;
      if (!this.isValid()) {
        return;
      }
      return this.categoryService.editCategory(this.categoryData).success((function(_this) {
        return function(response) {
          _this.categoryService.getCategories();
          _this.feedService.getCategoryFeedArticles(response);
          return _this.$modalInstance.close();
        };
      })(this));
    };

    EditCategoryController.prototype.closeAlert = function(alert) {
      return _.remove(this.alerts, alert);
    };

    EditCategoryController.prototype.close = function() {
      return this.$modalInstance.close();
    };

    return EditCategoryController;

  })();
  return angular.module('rssler').controller('EditCategoryController', ['$modalInstance', 'viewService', 'categoryService', 'feedService', EditCategoryController]);
})(angular);

(function(angular) {
  var EditFeedController;
  EditFeedController = (function() {
    function EditFeedController($modalInstance, viewService, categoryService, feedService) {
      var selectedIds;
      this.$modalInstance = $modalInstance;
      this.viewService = viewService;
      this.categoryService = categoryService;
      this.feedService = feedService;
      this.feedData = {
        title: this.viewService.currentView.data.title,
        id: this.viewService.currentView.data.id
      };
      this.categories = categoryService.categories;
      this.alerts = [];
      selectedIds = _.pluck(this.viewService.currentView.data.categories, 'id');
      this.selectedCategories = _.where(this.categories, function(category) {
        return _.contains(selectedIds, category.id);
      });
    }

    EditFeedController.prototype.editFeed = function() {
      var categoryIds;
      _.replaceArray(this.alerts, []);
      if (!this.feedData.title) {
        this.alerts.push({
          'msg': "Please enter a name.",
          'type': 'danger'
        });
        return;
      }
      categoryIds = _.pluck(this.selectedCategories, 'id');
      this.feedData.categoryIds = categoryIds;
      return this.feedService.editFeed(this.feedData).success((function(_this) {
        return function(response) {
          _this.categoryService.getCategories();
          _this.feedService.getFeedArticles(response);
          return _this.$modalInstance.close();
        };
      })(this))["catch"]((function(_this) {
        return function(response) {
          return _.replaceArray(_this.alerts, [response.data]);
        };
      })(this));
    };

    EditFeedController.prototype.closeAlert = function(alert) {
      return _.remove(this.alerts, alert);
    };

    EditFeedController.prototype.close = function() {
      return this.$modalInstance.close();
    };

    return EditFeedController;

  })();
  return angular.module('rssler').controller('EditFeedController', ['$modalInstance', 'viewService', 'categoryService', 'feedService', EditFeedController]);
})(angular);

(function(angular) {
  var FeedController;
  FeedController = (function() {
    function FeedController($interval, $modal, feedService, categoryService, searchService, viewService) {
      this.$interval = $interval;
      this.$modal = $modal;
      this.feedService = feedService;
      this.categoryService = categoryService;
      this.searchService = searchService;
      this.viewService = viewService;
      this.currentFeed = this.feedService.currentFeed;
      this.currentView = this.viewService.currentView;
      this.setUpdateInterval();
      this.hasCategories = this.categoryService.hasCategories.bind(this.categoryService);
    }

    FeedController.prototype.updatePage = function() {
      if (this.currentView.data.type === 'category') {
        return this.feedService.getCategoryFeedArticles(this.currentView.data, this.currentView.data.page);
      } else if (this.currentView.data.type === 'feed') {
        return this.feedService.getFeedArticles(this.currentView.data, this.currentView.data.page);
      } else if (this.currentView.data.type === 'search') {

      } else {
        return this.feedService.getAllFeedArticles(this.currentView.data.page);
      }
    };

    FeedController.prototype.editFeed = function() {
      return this.$modal.open({
        templateUrl: '/static/templates/edit_feed_modal.html',
        size: 'lg',
        controller: 'EditFeedController',
        controllerAs: 'editFeedCtrl'
      });
    };

    FeedController.prototype.deleteFeed = function() {
      return this.$modal.open({
        templateUrl: '/static/templates/delete_feed_modal.html',
        size: 'lg',
        controller: 'DeleteFeedController',
        controllerAs: 'deleteFeedCtrl'
      });
    };

    FeedController.prototype.editCategory = function() {
      return this.$modal.open({
        templateUrl: '/static/templates/edit_category_modal.html',
        size: 'lg',
        controller: 'EditCategoryController',
        controllerAs: 'editCategoryCtrl'
      });
    };

    FeedController.prototype.deleteCategory = function() {
      return this.$modal.open({
        templateUrl: '/static/templates/delete_category_modal.html',
        size: 'lg',
        controller: 'DeleteCategoryController',
        controllerAs: 'deleteCategoryCtrl'
      });
    };

    FeedController.prototype.setUpdateInterval = function() {
      var callback;
      callback = this.updatePage.bind(this);
      return this.$interval(callback, 30000);
    };

    return FeedController;

  })();
  return angular.module('rssler').controller('FeedController', ['$interval', '$modal', 'feedService', 'categoryService', 'searchService', 'viewService', FeedController]);
})(angular);

(function(angular) {
  var LoadingController;
  LoadingController = (function() {
    function LoadingController($scope, categoryService, feedService) {
      this.$scope = $scope;
      this.categoryService = categoryService;
      this.feedService = feedService;
      this.hasLoaded = false;
      this.loaded_percent = function() {
        var loaded;
        loaded = 0;
        if (this.categoryService.hasLoaded) {
          loaded += 1;
        }
        if (this.feedService.hasLoaded) {
          loaded += 1;
        }
        if (loaded === 2) {
          this.hasLoaded = true;
        }
        return loaded;
      };
    }

    return LoadingController;

  })();
  return angular.module('rssler').controller('LoadingController', ['$scope', 'categoryService', 'feedService', LoadingController]);
})(angular);

(function(angular) {
  var MainController;
  MainController = (function() {
    function MainController($modal, feedService, viewService, articleService) {
      this.$modal = $modal;
      this.feedService = feedService;
      this.viewService = viewService;
      this.articleService = articleService;
      this.currentFeed = [];
      this.currentArticle = this.articleService.currentArticle;
      this.visible = this.viewService.visible;
      this.feedService.getAllFeedArticles();
    }

    MainController.prototype.setFeedVisible = function() {
      this.visible.feedView = true;
      this.visible.articleView = false;
      return document.body.scrollTop = 0;
    };

    MainController.prototype.backToFeed = function() {
      return this.setFeedVisible();
    };

    MainController.prototype.loadArticle = function(article) {
      return this.articleService.getArticle(article).then((function(_this) {
        return function() {
          _this.visible.feedView = false;
          _this.visible.articleView = true;
          return document.body.scrollTop = 0;
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this.viewService.loadingStatus.isLoading = false;
        };
      })(this));
    };

    MainController.prototype.loadFeed = function(feed) {
      this.viewService.loadingStatus.isLoading = true;
      return this.feedService.getFeedArticles(feed).then((function(_this) {
        return function() {
          return _this.setFeedVisible();
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this.viewService.loadingStatus.isLoading = false;
        };
      })(this));
    };

    MainController.prototype.loadCategoryFeeds = function(category) {
      this.viewService.loadingStatus.isLoading = true;
      return this.feedService.getCategoryFeedArticles(category).then((function(_this) {
        return function() {
          return _this.setFeedVisible();
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this.viewService.loadingStatus.isLoading = false;
        };
      })(this));
    };

    MainController.prototype.loadAllCategoryFeeds = function() {
      this.viewService.loadingStatus.isLoading = true;
      return this.feedService.getAllFeedArticles().then((function(_this) {
        return function() {
          return _this.setFeedVisible();
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this.viewService.loadingStatus.isLoading = false;
        };
      })(this));
    };

    MainController.prototype.openNewFeedModal = function() {
      return this.$modal.open({
        templateUrl: '/static/templates/new_feed_modal.html',
        size: 'lg',
        controller: 'NewFeedController',
        controllerAs: 'newFeedCtrl'
      });
    };

    MainController.prototype.newCategory = function() {
      return this.$modal.open({
        templateUrl: '/static/templates/new_category_modal.html',
        size: 'lg',
        controller: 'NewCategoryController',
        controllerAs: 'newCategoryCtrl'
      });
    };

    MainController.prototype.editCategory = function() {
      return this.$modal.open({
        templateUrl: '/static/templates/edit_category_modal.html',
        size: 'lg',
        controller: 'EditCategoryController',
        controllerAs: 'editCategoryCtrl'
      });
    };

    MainController.prototype.openSettings = function() {
      return this.$modal.open({
        templateUrl: '/static/templates/settings_modal.html',
        size: 'lg',
        controller: 'SettingsController',
        controllerAs: 'settingsCtrl'
      });
    };

    return MainController;

  })();
  return angular.module('rssler').controller('MainController', ['$modal', 'feedService', 'viewService', 'articleService', MainController]);
})(angular);

(function(angular) {
  var NavController;
  NavController = (function() {
    function NavController($modal, viewService) {
      this.$modal = $modal;
      this.viewService = viewService;
      this.loadingStatus = this.viewService.loadingStatus;
    }

    NavController.prototype.openSettings = function() {
      return this.$modal.open({
        templateUrl: '/static/templates/settings_modal.html',
        size: 'lg',
        controller: 'SettingsController',
        controllerAs: 'settingsCtrl'
      });
    };

    return NavController;

  })();
  return angular.module('rssler').controller('NavController', ['$modal', 'viewService', NavController]);
})(angular);

(function(angular) {
  var NewCategoryController;
  NewCategoryController = (function() {
    function NewCategoryController($modalInstance, categoryService, feedService) {
      this.$modalInstance = $modalInstance;
      this.categoryService = categoryService;
      this.feedService = feedService;
      this.formData = {};
      this.categories = categoryService.categories;
      this.feeds = _.uniqCollection(_.flatten(_.pluck(this.categoryService.categories, 'feeds')));
      this.alerts = [];
    }

    NewCategoryController.prototype.isValid = function() {
      var valid;
      valid = true;
      _.replaceArray(this.alerts, []);
      if (this.categoryService.categoryExists(this.formData.title)) {
        this.alerts.push({
          'msg': "" + this.formData.title + " already exists in database.",
          'type': 'danger'
        });
        valid = false;
      }
      if (!this.formData.title) {
        this.alerts.push({
          'msg': "Please select a title.",
          'type': 'danger'
        });
        valid = false;
      }
      if (!this.selectedFeeds.length) {
        this.alerts.push({
          'msg': "Please select at least one feed.",
          'type': 'danger'
        });
        valid = false;
      }
      return valid;
    };

    NewCategoryController.prototype.addCategory = function() {
      var feedIds;
      if (!this.isValid()) {
        return;
      }
      feedIds = _.pluck(this.selectedFeeds, 'id');
      this.formData.feedIds = feedIds;
      return this.categoryService.addCategory(this.formData).success((function(_this) {
        return function(response) {
          _this.categoryService.getCategories();
          _this.feedService.getCategoryFeedArticles(response);
          return _this.$modalInstance.close();
        };
      })(this))["catch"]((function(_this) {
        return function(response) {
          return _.replaceArray(_this.alerts, [response.data]);
        };
      })(this));
    };

    NewCategoryController.prototype.closeAlert = function(alert) {
      return _.remove(this.alerts, alert);
    };

    NewCategoryController.prototype.close = function() {
      return this.$modalInstance.close();
    };

    return NewCategoryController;

  })();
  return angular.module('rssler').controller('NewCategoryController', ['$modalInstance', 'categoryService', 'feedService', NewCategoryController]);
})(angular);

(function(angular) {
  var NewFeedController;
  NewFeedController = (function() {
    function NewFeedController($modalInstance, categoryService, feedService) {
      this.$modalInstance = $modalInstance;
      this.categoryService = categoryService;
      this.feedService = feedService;
      this.formData = {};
      this.feedData = {};
      this.testAlerts = [];
      this.postAlerts = [];
      this.categories = categoryService.categories;
    }

    NewFeedController.prototype.feedDataEmpty = function() {
      return angular.equals({}, this.feedData);
    };

    NewFeedController.prototype.testFeed = function() {
      _.replaceArray(this.testAlerts, []);
      if (!this.formData.xml_url) {
        this.testAlerts.push({
          'msg': "Please enter a URL.",
          'type': 'danger'
        });
        return;
      }
      return this.feedService.testFeed(this.formData).then((function(_this) {
        return function(response) {
          return _.assign(_this.feedData, response.data);
        };
      })(this))["catch"]((function(_this) {
        return function(response) {
          return _.replaceArray(_this.testAlerts, [response.data]);
        };
      })(this));
    };

    NewFeedController.prototype.addFeed = function() {
      var categoryIds, formData;
      categoryIds = _.pluck(this.selectedCategories, 'id');
      formData = this.feedData;
      this.feedData.categoryIds = categoryIds;
      return this.feedService.newFeed(this.feedData).success((function(_this) {
        return function(response) {
          _this.categoryService.getCategories();
          _this.feedService.getFeedArticles(response);
          return _this.$modalInstance.close();
        };
      })(this));
    };

    NewFeedController.prototype.closeAlert = function(alert) {
      return _.remove(this.testAlerts, alert);
    };

    NewFeedController.prototype.close = function() {
      return this.$modalInstance.close();
    };

    return NewFeedController;

  })();
  return angular.module('rssler').controller('NewFeedController', ['$modalInstance', 'categoryService', 'feedService', NewFeedController]);
})(angular);

(function(angular) {
  var SearchController;
  SearchController = (function() {
    function SearchController(searchService, $modal) {
      this.searchService = searchService;
      this.$modal = $modal;
      this.searchData = {};
    }

    SearchController.prototype.search = function() {
      if (angular.equals(this.searchData, {})) {
        return;
      }
      return this.searchService.search(this.searchData);
    };

    SearchController.prototype.advancedSearch = function() {
      return this.$modal.open({
        templateUrl: '/static/templates/advanced_search_modal.html',
        size: 'lg',
        controller: 'AdvancedSearchController',
        controllerAs: 'advancedSearchCtrl'
      });
    };

    return SearchController;

  })();
  return angular.module('rssler').controller('SearchController', ['searchService', '$modal', SearchController]);
})(angular);

(function(angular) {
  var SettingsController;
  SettingsController = (function() {
    function SettingsController($modalInstance, settingsService, categoryService) {
      this.$modalInstance = $modalInstance;
      this.settingsService = settingsService;
      this.categoryService = categoryService;
      this.opmlAlerts = [];
      this.willDownload = {
        msg: "Feed articles will be downloaded shortly.",
        type: 'success'
      };
      this.settingsService.getDBSize().then((function(_this) {
        return function(response) {
          return _this.dbSize = response.data.size;
        };
      })(this));
    }

    SettingsController.prototype.submit = function() {
      var f, r;
      f = document.getElementById('file').files[0];
      if (!f) {
        _.replaceArray(this.opmlAlerts, [
          {
            msg: 'No file selected.',
            type: 'danger'
          }
        ]);
        return;
      }
      r = new FileReader();
      r.onloadend = (function(_this) {
        return function(e) {
          var data;
          data = e.target.result;
          return _this.settingsService.sendOPML({
            'opml': data
          }).then(function(response) {
            _this.replaceAlerts(response);
            return _this.categoryService.getCategories();
          })["catch"](function(response) {
            return _this.replaceAlerts(response);
          });
        };
      })(this);
      return r.readAsBinaryString(f);
    };

    SettingsController.prototype.replaceAlerts = function(response) {
      _.replaceArray(this.opmlAlerts, [response.data]);
      if (response.data.type === "success" || response.data.type === "warning") {
        return this.opmlAlerts.push(this.willDownload);
      }
    };

    SettingsController.prototype.closeAlert = function(alert) {
      return _.remove(this.opmlAlerts, alert);
    };

    SettingsController.prototype.close = function() {
      return this.$modalInstance.close();
    };

    return SettingsController;

  })();
  return angular.module('rssler').controller('SettingsController', ['$modalInstance', 'settingsService', 'categoryService', SettingsController]);
})(angular);

(function(angular) {
  var EditDropdown;
  EditDropdown = (function() {
    function EditDropdown() {}

    EditDropdown.prototype.restrict = 'E';

    EditDropdown.prototype.replace = true;

    EditDropdown.prototype.templateUrl = '/static/templates/edit_dropdown.html';

    return EditDropdown;

  })();
  return angular.module('rssler').directive('editDropdown', function() {
    return new EditDropdown;
  });
})(angular);

(function(angular) {
  var FeedTable;
  FeedTable = (function() {
    function FeedTable() {}

    FeedTable.prototype.restrict = 'E';

    FeedTable.prototype.replace = true;

    FeedTable.prototype.templateUrl = '/static/templates/feed_table.html';

    return FeedTable;

  })();
  return angular.module('rssler').directive('feedTable', function() {
    return new FeedTable;
  });
})(angular);

(function(angular) {
  var LoadingScreen;
  LoadingScreen = (function() {
    function LoadingScreen() {}

    LoadingScreen.prototype.restrict = 'A';

    LoadingScreen.prototype.link = LoadingScreen.link;

    LoadingScreen.prototype.scope = {
      hasLoaded: '=hasLoaded'
    };

    LoadingScreen.prototype.link = function(scope, element, attrs) {
      return scope.$watch('hasLoaded', (function(_this) {
        return function(newVal, oldVal) {
          if (newVal) {
            return element.delay(1000).fadeOut();
          }
        };
      })(this));
    };

    return LoadingScreen;

  })();
  return angular.module('rssler').directive('loadingScreen', function() {
    return new LoadingScreen;
  });
})(angular);

(function(angular) {
  var Navbar;
  Navbar = (function() {
    function Navbar() {}

    Navbar.prototype.restrict = 'E';

    Navbar.prototype.replace = true;

    Navbar.prototype.templateUrl = '/static/templates/nav_bar.html';

    return Navbar;

  })();
  return angular.module('rssler').directive('navBar', function() {
    return new Navbar;
  });
})(angular);

(function(angular) {
  var Sidebar;
  Sidebar = (function() {
    function Sidebar() {}

    Sidebar.prototype.restrict = 'E';

    Sidebar.prototype.replace = true;

    Sidebar.prototype.templateUrl = '/static/templates/sidebar.html';

    return Sidebar;

  })();
  return angular.module('rssler').directive('sidebar', function() {
    return new Sidebar;
  });
})(angular);

(function(angular) {
  var SidebarExpand;
  SidebarExpand = (function() {
    function SidebarExpand() {}

    SidebarExpand.prototype.restrict = 'A';

    SidebarExpand.prototype.link = SidebarExpand.link;

    SidebarExpand.prototype.link = function(scope, element, attrs) {
      return $(element).on('click', '[data-toggle=offcanvas]', function() {
        return element.toggleClass('sidebar-expanded');
      });
    };

    return SidebarExpand;

  })();
  return angular.module('rssler').directive('sidebarExpand', function() {
    return new SidebarExpand;
  });
})(angular);

(function(angular) {
  var SlideDown;
  SlideDown = (function() {
    function SlideDown() {}

    SlideDown.prototype.restrict = 'A';

    SlideDown.prototype.link = SlideDown.link;

    SlideDown.prototype.scope = {
      isOpen: '=slideToggle',
      category: '=category'
    };

    SlideDown.prototype.link = function(scope, element, attrs) {
      var slideDuration;
      slideDuration = parseInt(attrs.slideToggleDuration, 10) || 200;
      return scope.$watch('category.expanded', (function(_this) {
        return function(newVal, oldVal) {
          if (newVal !== oldVal) {
            return element.stop().slideToggle(slideDuration);
          }
        };
      })(this));
    };

    return SlideDown;

  })();
  return angular.module('rssler').directive('slideDown', function() {
    return new SlideDown;
  });
})(angular);

(function(angular) {
  var ByteFilter;
  ByteFilter = (function() {
    function ByteFilter() {
      return (function(_this) {
        return function(bytes) {
          return _this.filter(bytes);
        };
      })(this);
    }

    ByteFilter.prototype.filter = function(bytes, precision) {
      var number, units;
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
        return '-';
      }
      if (typeof precision === 'undefined') {
        precision = 1;
      }
      units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
      number = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };

    return ByteFilter;

  })();
  return angular.module('rssler').filter('byteFilter', function() {
    return new ByteFilter();
  });
})(angular);

(function(angular) {
  var DateFilter;
  DateFilter = (function() {
    function DateFilter($filter) {
      this.$filter = $filter;
      return (function(_this) {
        return function(inputDate) {
          return _this.filter(inputDate);
        };
      })(this);
    }

    DateFilter.prototype.isYesterday = function(timestamp) {
      var compDate, now, tsToDate, yesterday;
      tsToDate = new Date(timestamp);
      compDate = new Date(tsToDate.getFullYear(), tsToDate.getMonth(), tsToDate.getDate());
      now = new Date();
      yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      return compDate <= yesterday;
    };

    DateFilter.prototype.isLastYear = function(timestamp) {
      var articleYear, nowYear;
      articleYear = new Date(timestamp).getFullYear();
      nowYear = new Date().getFullYear();
      return articleYear < nowYear;
    };

    DateFilter.prototype.filter = function(inputDate) {
      var $ngDateFilter, timestamp;
      $ngDateFilter = this.$filter('date');
      timestamp = Date.parse(inputDate);
      if (this.isLastYear(timestamp)) {
        return $ngDateFilter(timestamp, 'MM/dd/yy');
      }
      if (this.isYesterday(timestamp)) {
        return $ngDateFilter(timestamp, 'MM/dd h:mm a');
      }
      return $ngDateFilter(timestamp, 'shortTime');
    };

    return DateFilter;

  })();
  return angular.module('rssler').filter('dateFilter', [
    '$filter', function($filter) {
      return new DateFilter($filter);
    }
  ]);
})(angular);

(function(angular) {
  var ArticleService;
  ArticleService = (function() {
    function ArticleService($http, viewService) {
      this.$http = $http;
      this.viewService = viewService;
      this.currentArticle = {};
    }

    ArticleService.prototype.getArticle = function(article) {
      this.viewService.loadingStatus.isLoading = true;
      return this.$http.get("/article/" + article.id, {
        cache: true
      }).then((function(_this) {
        return function(response) {
          return _.assign(_this.currentArticle, response.data);
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this.viewService.loadingStatus.isLoading = false;
        };
      })(this));
    };

    return ArticleService;

  })();
  return angular.module('rssler').service('articleService', ['$http', 'viewService', ArticleService]);
})(angular);

(function(angular) {
  var CategoryService;
  CategoryService = (function() {
    function CategoryService($http) {
      this.$http = $http;
      this.hasLoaded = false;
      this.categories = [];
      this.uncategorized = {};
    }

    CategoryService.prototype.getCategories = function() {
      return this.$http.get('/categories').then((function(_this) {
        return function(response) {
          var categories, uncategorized;
          categories = response.data.objects;
          uncategorized = _.find(categories, function(category) {
            return category.title === "Uncategorized";
          });
          _.assign(_this.uncategorized, uncategorized);
          _.remove(categories, function(category) {
            return category.title === "Uncategorized";
          });
          return _.replaceArray(_this.categories, categories);
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this.hasLoaded = true;
        };
      })(this));
    };

    CategoryService.prototype.editCategory = function(formData) {
      return this.$http.put("/category/" + formData.id, formData);
    };

    CategoryService.prototype.addCategory = function(formData) {
      return this.$http.post('/categories', formData);
    };

    CategoryService.prototype.deleteCategory = function(formData) {
      return this.$http["delete"]("/category/" + formData.id, formData);
    };

    CategoryService.prototype.categoryExists = function(title, id) {
      var existingCategory;
      existingCategory = _.find(this.categories, {
        'title': title
      });
      if (!id && !existingCategory) {
        return false;
      }
      if (!id && existingCategory) {
        return true;
      }
      if (existingCategory.id === id) {
        return false;
      } else {
        return true;
      }
    };

    CategoryService.prototype.hasCategories = function() {
      if (this.categories.length) {
        return true;
      }
      if (!angular.equals(this.uncategorized, {}) && this.uncategorized.feeds.length) {
        return true;
      }
      return false;
    };

    return CategoryService;

  })();
  return angular.module('rssler').service('categoryService', ['$http', CategoryService]);
})(angular);

(function(angular) {
  var FeedService;
  FeedService = (function() {
    function FeedService($http, viewService) {
      this.$http = $http;
      this.viewService = viewService;
      this.currentFeed = [];
      this.hasLoaded = false;
    }

    FeedService.prototype.getAllFeeds = function() {
      return this.$http.get("/feeds");
    };

    FeedService.prototype.getFeedArticles = function(feed, page) {
      this.viewService.loadingStatus.isLoading = true;
      return this.$http.get("/feed/" + feed.id).then((function(_this) {
        return function(response) {
          _this.currentFeed.length = 0;
          _this.currentFeed.push.apply(_this.currentFeed, response.data.articles);
          return _this.viewService.currentView.data = {
            title: response.data.title,
            id: response.data.id,
            type: 'feed',
            page: response.data.page,
            categories: response.data.categories,
            totalPages: parseInt(response.data.total_pages) * 40
          };
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this.viewService.loadingStatus.isLoading = false;
        };
      })(this));
    };

    FeedService.prototype.getCategoryFeedArticles = function(category, page) {
      var pageFragment, url;
      this.viewService.loadingStatus.isLoading = true;
      pageFragment = page ? "?page=" + page : "?page=1";
      url = ("/category/" + category.id + "/articles") + pageFragment;
      return this.$http.get(url).then((function(_this) {
        return function(response) {
          _this.currentFeed.length = 0;
          _this.currentFeed.push.apply(_this.currentFeed, response.data.objects);
          return _this.viewService.currentView.data = {
            title: category.title,
            id: category.id,
            page: response.data.page,
            type: 'category',
            totalItems: parseInt(response.data.total_pages) * 40
          };
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this.viewService.loadingStatus.isLoading = false;
        };
      })(this));
    };

    FeedService.prototype.getAllFeedArticles = function(page) {
      var pageFragment, url;
      this.viewService.loadingStatus.isLoading = true;
      pageFragment = page ? "?page=" + page : "?page=1";
      url = "/articles" + pageFragment;
      return this.$http.get(url).then((function(_this) {
        return function(response) {
          _this.currentFeed.length = 0;
          _this.currentFeed.push.apply(_this.currentFeed, response.data.objects);
          return _this.viewService.currentView.data = {
            title: 'All',
            id: null,
            type: 'all',
            page: response.data.page,
            totalItems: parseInt(response.data.total_pages) * 40
          };
        };
      })(this))["finally"]((function(_this) {
        return function() {
          _this.viewService.loadingStatus.isLoading = false;
          return _this.hasLoaded = true;
        };
      })(this));
    };

    FeedService.prototype.testFeed = function(formData) {
      return this.$http.post('/feed/test/', formData);
    };

    FeedService.prototype.newFeed = function(formData) {
      return this.$http.post('/feeds', formData);
    };

    FeedService.prototype.editFeed = function(formData) {
      return this.$http.put("/feed/" + formData.id, formData);
    };

    FeedService.prototype.deleteFeed = function(feed) {
      return this.$http["delete"]("/feed/" + feed.id);
    };

    return FeedService;

  })();
  return angular.module('rssler').service('feedService', ['$http', 'viewService', FeedService]);
})(angular);

(function(angular) {
  var SearchService;
  SearchService = (function() {
    function SearchService($http, $q, $timeout, feedService, viewService) {
      this.$http = $http;
      this.$q = $q;
      this.$timeout = $timeout;
      this.feedService = feedService;
      this.viewService = viewService;
    }

    SearchService.prototype.search = function(searchData, page) {
      var pageFragment, url;
      this.viewService.loadingStatus.isLoading = true;
      pageFragment = page ? "?page=" + page : "?page=1";
      url = "/search" + pageFragment;
      return this.$http.post(url, searchData).then((function(_this) {
        return function(response) {
          _this.viewService.currentView.data = {
            title: 'Search Results',
            id: null,
            page: response.data.page,
            type: 'search',
            totalItems: parseInt(response.data.total_pages) * 40,
            searchData: searchData
          };
          _.replaceArray(_this.feedService.currentFeed, response.data.objects);
          _this.viewService.visible.feedView = true;
          _this.viewService.visible.articleView = false;
          return document.body.scrollTop = 0;
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this.viewService.loadingStatus.isLoading = false;
        };
      })(this));
    };

    return SearchService;

  })();
  return angular.module('rssler').service('searchService', ['$http', '$q', '$timeout', 'feedService', 'viewService', SearchService]);
})(angular);

(function(angular) {
  var SettingsService;
  SettingsService = (function() {
    function SettingsService($http) {
      this.$http = $http;
      this.currentArticle = {};
    }

    SettingsService.prototype.sendOPML = function(data) {
      return this.$http.post('/opml', data);
    };

    SettingsService.prototype.getDBSize = function() {
      return this.$http.get('/db/size');
    };

    return SettingsService;

  })();
  return angular.module('rssler').service('settingsService', ['$http', SettingsService]);
})(angular);

(function(angular) {
  var ViewService;
  ViewService = (function() {
    function ViewService() {
      this.currentView = {
        data: null
      };
      this.visible = {
        feedView: true,
        articleView: false
      };
      this.loadingStatus = {
        isLoading: false
      };
    }

    return ViewService;

  })();
  return angular.module('rssler').service('viewService', ViewService);
})(angular);
