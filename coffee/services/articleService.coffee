do (angular=angular) ->
    class ArticleService
        constructor: (@$http, @viewService) ->
            @currentArticle = {}

        getArticle: (article) ->
            @viewService.loadingStatus.isLoading = true

            @$http.get("/article/#{article.id}", {cache: true})
                .then (response) =>
                    _.assign(@currentArticle, response.data)
                .finally => @viewService.loadingStatus.isLoading = false

    angular.module('rssler').service 'articleService', ['$http', 'viewService', ArticleService]