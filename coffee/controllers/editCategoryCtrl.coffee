do (angular=angular) ->
    class EditCategoryController

        constructor: (@$modalInstance, @viewService, @categoryService, @feedService) ->
            @categoryData =
                title: @viewService.currentView.data.title
                id: @viewService.currentView.data.id

            @feeds = _.uniqCollection(_.flatten(_.pluck(@categoryService.categories, 'feeds')))

            categoryFeeds = _.find(@categoryService.categories, (category) => category.id == @categoryData.id).feeds
            selectedIds = _.pluck(categoryFeeds, 'id')
            @selectedFeeds =  _.where(@feeds, (feed) -> _.contains(selectedIds, feed.id))

            @alerts = []


        isValid: ->
            valid = true
            _.replaceArray(@alerts, [])

            if not @categoryData.title
                @alerts.push({'msg': "Please select a title.", 'type': 'danger'})
                valid = false

            if @categoryService.categoryExists(@categoryData.title, @categoryData.id)
                @alerts.push({'msg': "#{@categoryData.title} already exists in database.", 'type': 'danger'})
                valid = false

            if not @selectedFeeds.length
                @alerts.push({'msg': "Please select at least one feed.", 'type': 'danger'})
                valid = false
            
            return valid

        editCategory: ->
            feedIds = _.pluck(@selectedFeeds, 'id')
            @categoryData.feedIds = feedIds

            if not @isValid()
                return

            @categoryService.editCategory(@categoryData)
                .success (response) =>
                    @categoryService.getCategories()
                    @feedService.getCategoryFeedArticles(response)
                    @$modalInstance.close()

        closeAlert: (alert) -> _.remove(@alerts, alert)

        close: ->
            @$modalInstance.close()


    angular.module('rssler').controller('EditCategoryController', ['$modalInstance', 'viewService', 'categoryService', 'feedService', EditCategoryController])