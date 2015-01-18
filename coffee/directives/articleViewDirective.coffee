do (angular=angular) ->
    console.log ('running article view')
    class ArticleView
        restrict: 'E'
        replace: true
        templateUrl: '/static/templates/article_view.html'

    angular.module('rssler').directive('articleView', -> new ArticleView)