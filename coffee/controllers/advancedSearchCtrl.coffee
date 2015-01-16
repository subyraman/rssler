do (angular=angular) ->
    class AdvancedSearchController
        constructor:  (@$modalInstance, @feedService, @categoryService, @searchService) ->
            @feeds = []
            @categories = @categoryService.categories
            @startOpened = false
            @endOpened = false
            @dateFormat = 'dd-MMMM-yyyy'
            @searchData = {}

            @feedService.getAllFeeds()
                .then (response) => 
                    _.replaceArray(@feeds, response.data.objects)

        openStart: ($event) ->
            $event.preventDefault()
            $event.stopPropagation()
            @startOpened = true

        openEnd: ($event) ->
            $event.preventDefault()
            $event.stopPropagation()
            @endOpened = true

        search: ->
            @searchData.start_date = if @startDate then @startDate.getTime() else ""
            @searchData.end_date =  if @endDate then @endDate.getTime() else ""
            @searchData.feed_ids = if @selectedFeeds then _.pluck(@selectedFeeds, 'id') else []
            @searchData.category_ids = if @selectedCategories then _.pluck(@selectedCategories, 'id') else []

            @searchService.search(@searchData)
                .then =>
                    @$modalInstance.close()

    angular.module('rssler').controller('AdvancedSearchController', ['$modalInstance', 'feedService', 'categoryService', 'searchService', AdvancedSearchController])