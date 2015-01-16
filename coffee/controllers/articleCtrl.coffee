do (angular=angular) ->
    class ArticleController
        constructor: (@feedService) ->
            @currentArticle = @feedService.currentArticle


    angular.module('rssler').controller('ArticleController', ['articleService', ArticleController])