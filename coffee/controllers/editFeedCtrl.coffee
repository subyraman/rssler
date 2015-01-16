do (angular=angular) ->
    class EditFeedController

        constructor: (@$modalInstance, @viewService, @categoryService, @feedService) ->
            @feedData =
                title: @viewService.currentView.data.title
                id: @viewService.currentView.data.id
            @categories = categoryService.categories
            @alerts = []

            selectedIds = _.pluck(@viewService.currentView.data.categories, 'id')
            @selectedCategories = _.where(@categories, (category) -> _.contains(selectedIds, category.id))


        editFeed: ->
            _.replaceArray(@alerts, [])
            if not @feedData.title
                @alerts.push({'msg': "Please enter a name.", 'type': 'danger'})
                return

            categoryIds = _.pluck(@selectedCategories, 'id')
            @feedData.categoryIds = categoryIds

            @feedService.editFeed(@feedData)
                .success (response) =>
                    @categoryService.getCategories()
                    @feedService.getFeedArticles(response)
                    @$modalInstance.close()
                .catch (response) =>
                    _.replaceArray(@alerts, [response.data])

        closeAlert: (alert) -> _.remove(@alerts, alert)

        close: ->
            @$modalInstance.close()


    angular.module('rssler').controller('EditFeedController', ['$modalInstance', 'viewService', 'categoryService', 'feedService', EditFeedController])