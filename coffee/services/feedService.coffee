do (angular=angular) ->
    class FeedService
        constructor: (@$http, @viewService) ->
            @currentFeed = []
            @hasLoaded = false

        getAllFeeds: ->
            @$http.get("/feeds")


        getFeedArticles: (feed, page) ->
            @viewService.loadingStatus.isLoading = true

            pageFragment = if page then "?page=#{page}" else "?page=1"
            url = "/feed/#{feed.id}/articles" + pageFragment

            @$http.get(url)
                .then (response) =>
                    @currentFeed.length = 0
                    @currentFeed.push.apply(@currentFeed, response.data.articles)
   
                    @viewService.currentView.data =
                        title: response.data.title
                        id: response.data.id
                        type: 'feed'
                        page: response.data.page
                        categories: response.data.categories
                        totalItems: parseInt(response.data.total_pages)  * 40

                .finally => @viewService.loadingStatus.isLoading = false


        getCategoryFeedArticles: (category, page) ->
            @viewService.loadingStatus.isLoading = true
            
            pageFragment = if page then "?page=#{page}" else "?page=1"
            url = "/category/#{category.id}/articles" + pageFragment

            @$http.get(url)
                .then (response) =>        
                    @currentFeed.length = 0
                    @currentFeed.push.apply(@currentFeed, response.data.objects)

                    @viewService.currentView.data =
                        title: category.title
                        id: category.id
                        page: response.data.page
                        type: 'category'
                        totalItems: parseInt(response.data.total_pages) * 40

                .finally => @viewService.loadingStatus.isLoading = false

        getAllFeedArticles: (page) ->
            @viewService.loadingStatus.isLoading = true
            
            pageFragment = if page then "?page=#{page}" else "?page=1"
            url = "/articles" + pageFragment
            
            @$http.get(url)
                .then (response) =>
                    @currentFeed.length = 0
                    @currentFeed.push.apply(@currentFeed, response.data.objects)
                    
                    @viewService.currentView.data =
                        title: 'All'
                        id: null
                        type: 'all'
                        page: response.data.page
                        totalItems: parseInt(response.data.total_pages)  * 40

                .finally =>
                    @viewService.loadingStatus.isLoading = false
                    @hasLoaded = true

        testFeed: (formData)->
            @$http.post('/feed/test/', formData)

        newFeed: (formData) ->
            @$http.post('/feeds', formData)

        editFeed: (formData) ->
            @$http.put("/feed/#{formData.id}", formData)


        deleteFeed: (feed) ->
            @$http.delete("/feed/#{feed.id}")

    angular.module('rssler').service 'feedService', ['$http', 'viewService', FeedService]