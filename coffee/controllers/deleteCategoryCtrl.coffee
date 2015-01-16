do (angular=angular) ->
    class DeleteCategoryController

        constructor: (@$modalInstance, @feedService, @categoryService, @viewService) ->
            @category = @viewService.currentView.data

        deleteCategory: ->
            @categoryService.deleteCategory(@category)
                .then =>
                    @categoryService.getCategories()
                    @feedService.getAllFeedArticles()
                    @$modalInstance.close()

        close: ->
            @$modalInstance.close()


    angular.module('rssler').controller('DeleteCategoryController', ['$modalInstance', 'feedService', 'categoryService', 'viewService', DeleteCategoryController])