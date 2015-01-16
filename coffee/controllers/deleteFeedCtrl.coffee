do (angular=angular) ->
    class DeleteFeedController

        constructor: (@$modalInstance, @feedService, @categoryService, @viewService) ->
            @feed = @viewService.currentView.data

        deleteFeed: ->
            @feedService.deleteFeed(@feed)
                .then =>
                    @categoryService.getCategories()
                    @feedService.getAllFeedArticles()
                    @$modalInstance.close()



        close: ->
            @$modalInstance.close()


    angular.module('rssler').controller('DeleteFeedController', ['$modalInstance', 'feedService', 'categoryService', 'viewService', DeleteFeedController])