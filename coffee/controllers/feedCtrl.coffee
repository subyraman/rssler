do (angular=angular) ->
    class FeedController
        constructor: (@$interval, @$modal, @feedService, @categoryService, @searchService, @viewService) ->
            @currentFeed = @feedService.currentFeed
            @currentView = @viewService.currentView
            @setUpdateInterval()
            @hasCategories = @categoryService.hasCategories.bind(@categoryService)

        updatePage: ->
            if @currentView.data.type == 'category'
                @feedService.getCategoryFeedArticles(@currentView.data, @currentView.data.page)
            else if @currentView.data.type == 'feed'
                @feedService.getFeedArticles(@currentView.data, @currentView.data.page)
            else if @currentView.data.type == 'search'
                return
            else
                @feedService.getAllFeedArticles(@currentView.data.page)

        editFeed: ->
            @$modal.open
                templateUrl: '/static/templates/edit_feed_modal.html'
                size: 'lg'
                controller: 'EditFeedController'
                controllerAs: 'editFeedCtrl'

        deleteFeed: ->
            @$modal.open
                templateUrl: '/static/templates/delete_feed_modal.html'
                size: 'lg'
                controller: 'DeleteFeedController'
                controllerAs: 'deleteFeedCtrl'

        editCategory: ->
            @$modal.open
                templateUrl: '/static/templates/edit_category_modal.html'
                size: 'lg'
                controller: 'EditCategoryController'
                controllerAs: 'editCategoryCtrl'

        deleteCategory: ->
            @$modal.open
                templateUrl: '/static/templates/delete_category_modal.html'
                size: 'lg'
                controller: 'DeleteCategoryController'
                controllerAs: 'deleteCategoryCtrl'



        setUpdateInterval: ->
            callback = @updatePage.bind(this)
            @$interval(callback, 30000)

    angular.module('rssler').controller('FeedController', ['$interval', '$modal', 'feedService', 'categoryService', 'searchService', 'viewService', FeedController])