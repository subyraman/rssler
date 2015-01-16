do (angular=angular) ->
    class NewFeedController

        constructor: (@$modalInstance, @categoryService, @feedService) ->
            @formData = {}
            @feedData = {}
            @testAlerts = []
            @postAlerts = []
            @categories = categoryService.categories

        feedDataEmpty: ->
            return angular.equals({}, @feedData)

        testFeed: ->
            _.replaceArray(@testAlerts, [])
            if not @formData.xml_url
                @testAlerts.push({'msg': "Please enter a URL.", 'type': 'danger'})
                return

            @feedService.testFeed(@formData)
                .then (response) =>
                    _.assign(@feedData, response.data)
                .catch (response) =>
                    _.replaceArray(@testAlerts, [response.data])

        addFeed: ->
            categoryIds = _.pluck(@selectedCategories, 'id')
            formData = @feedData
            @feedData.categoryIds = categoryIds

            @feedService.newFeed(@feedData)
                .success (response) =>
                    @categoryService.getCategories()
                    @feedService.getFeedArticles(response)
                    @$modalInstance.close()
        
        closeAlert: (alert) -> _.remove(@testAlerts, alert)

        close: ->
            @$modalInstance.close()


    angular.module('rssler').controller('NewFeedController', ['$modalInstance', 'categoryService', 'feedService', NewFeedController])