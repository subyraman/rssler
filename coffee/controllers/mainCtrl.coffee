do (angular=angular) ->
    class MainController
        constructor: (@$modal, @feedService, @viewService, @articleService) ->
            @currentFeed = []
            @currentArticle = @articleService.currentArticle
            @visible = @viewService.visible

            @feedService.getAllFeedArticles()

        setFeedVisible: ->
            @visible.feedView = true
            @visible.articleView = false
            document.body.scrollTop = 0

        backToFeed: -> @setFeedVisible()

        loadArticle: (article) ->
            @articleService.getArticle(article)
                .then =>
                    @visible.feedView = false
                    @visible.articleView = true
                    document.body.scrollTop = 0
                .finally =>
                    @viewService.loadingStatus.isLoading = false

        loadFeed: (feed) ->
            @viewService.loadingStatus.isLoading = true

            @feedService.getFeedArticles(feed)
                .then => @setFeedVisible()
                .finally =>
                    @viewService.loadingStatus.isLoading = false

        loadCategoryFeeds: (category) ->
            @viewService.loadingStatus.isLoading = true

            @feedService.getCategoryFeedArticles(category)
                .then => @setFeedVisible()
                .finally =>
                    @viewService.loadingStatus.isLoading = false

        loadAllCategoryFeeds: ->
            @viewService.loadingStatus.isLoading = true

            @feedService.getAllFeedArticles()
                .then => @setFeedVisible()
                .finally =>
                    @viewService.loadingStatus.isLoading = false

        openNewFeedModal: ->
            @$modal.open
                templateUrl: '/static/templates/new_feed_modal.html'
                size: 'lg'
                controller: 'NewFeedController'
                controllerAs: 'newFeedCtrl'

        newCategory: ->
            @$modal.open
                templateUrl: '/static/templates/new_category_modal.html'
                size: 'lg'
                controller: 'NewCategoryController'
                controllerAs: 'newCategoryCtrl'

        editCategory: ->
            @$modal.open
                templateUrl: '/static/templates/edit_category_modal.html'
                size: 'lg'
                controller: 'EditCategoryController'
                controllerAs: 'editCategoryCtrl'

        openSettings: ->
            @$modal.open
                templateUrl: '/static/templates/settings_modal.html'
                size: 'lg'
                controller: 'SettingsController'
                controllerAs: 'settingsCtrl'


    angular.module('rssler').controller('MainController', ['$modal', 'feedService', 'viewService', 'articleService', MainController])