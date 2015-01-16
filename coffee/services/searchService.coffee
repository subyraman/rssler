do (angular=angular) ->
    class SearchService
        constructor: (@$http, @$q, @$timeout, @feedService, @viewService) ->


        search: (searchData, page) ->
            @viewService.loadingStatus.isLoading = true
            
            pageFragment = if page then "?page=#{page}" else "?page=1"
            url = "/search" + pageFragment

            @$http.post(url, searchData)
                .then (response) =>
                    @viewService.currentView.data =
                        title: 'Search Results'
                        id: null
                        page: response.data.page
                        type: 'search'
                        totalItems: parseInt(response.data.total_pages) * 40
                        searchData: searchData

                    _.replaceArray(@feedService.currentFeed, response.data.objects)

                    @viewService.visible.feedView = true
                    @viewService.visible.articleView = false
                    document.body.scrollTop = 0

                .finally => @viewService.loadingStatus.isLoading = false

    angular.module('rssler').service 'searchService', ['$http', '$q', '$timeout', 'feedService', 'viewService', SearchService]