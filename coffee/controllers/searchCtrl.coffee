do (angular=angular) ->
    class SearchController
        constructor: (@searchService, @$modal) ->
            @searchData = {}

        search: ->
            if angular.equals(@searchData, {})
                return

            @searchService.search(@searchData)

        advancedSearch: ->
            @$modal.open
                templateUrl: '/static/templates/advanced_search_modal.html'
                size: 'lg'
                controller: 'AdvancedSearchController'
                controllerAs: 'advancedSearchCtrl'
            

    angular.module('rssler').controller('SearchController', ['searchService', '$modal', SearchController])