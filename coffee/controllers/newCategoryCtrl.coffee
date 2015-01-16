do (angular=angular) ->
    class NewCategoryController

        constructor: (@$modalInstance, @categoryService, @feedService) ->
            @formData = {}
            @categories = categoryService.categories
            @feeds = []
            @alerts = []

            @feedService.getAllFeeds()
                .then (response) => 
                    _.replaceArray(@feeds, response.data.objects)

        isValid: ->
            valid = true
            _.replaceArray(@alerts, [])

            if @categoryService.categoryExists(@formData.title)
                @alerts.push({'msg': "#{@formData.title} already exists in database.", 'type': 'danger'})
                valid = false
            if not @formData.title
                @alerts.push({'msg': "Please select a title.", 'type': 'danger'})
                valid = false
            
            return valid

        addCategory: ->
            if not @isValid()
                return

            feedIds = _.pluck(@selectedFeeds, 'id')
            @formData.feedIds = feedIds

            @categoryService.addCategory(@formData)
                .success (response) =>
                    @categoryService.getCategories()
                    @feedService.getCategoryFeedArticles(response)
                    @$modalInstance.close()
                .catch (response) =>
                    _.replaceArray(@alerts, [response.data])

        closeAlert: (alert) -> _.remove(@alerts, alert)

        close: ->
            @$modalInstance.close()


    angular.module('rssler').controller('NewCategoryController', ['$modalInstance', 'categoryService', 'feedService', NewCategoryController])