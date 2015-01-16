do (angular=angular) ->
    class CategoryController
        constructor: (@categoryService) ->
            @categories = @categoryService.categories
            @uncategorized = @categoryService.uncategorized
            @categoryService.getCategories()
            @hasCategories = @categoryService.hasCategories.bind(@categoryService)

        toggle: (category) ->
            category.expanded = !category.expanded


    angular.module('rssler').controller('CategoryController', ['categoryService', CategoryController])