do (angular=angular) ->
    class CategoryService

        constructor: (@$http) ->
            @hasLoaded = false
            @categories = []
            @uncategorized = {}

        getCategories: ->
            @$http.get('/categories')
                .then (response) =>
                    categories = response.data.objects
                    uncategorized = _.find(categories, (category) -> category.title == "Uncategorized")

                    _.assign(@uncategorized, uncategorized)
                    _.remove(categories, (category) -> category.title == "Uncategorized")

                    _.replaceArray(@categories, categories)
                .finally =>
                    @hasLoaded = true

        editCategory: (formData) ->
            @$http.put("/category/#{formData.id}", formData)

        addCategory: (formData) ->
            @$http.post('/categories', formData)

        deleteCategory: (formData) ->
            @$http.delete("/category/#{formData.id}", formData)

        categoryExists: (title, id) ->
            existingCategory = _.find(@categories, {'title': title})

            if not id and not existingCategory
                return false
            if not id and existingCategory
                return true

            if existingCategory.id == id
                return false
            else
                return true


        hasCategories: ->
            if @categories.length
                return true

            if not angular.equals(@uncategorized, {}) and @uncategorized.feeds.length
                return true

            return false


    angular.module('rssler').service 'categoryService', ['$http', CategoryService]