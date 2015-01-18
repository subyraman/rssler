do (angular=angular) ->
    class FeedTable
        restrict: 'E'
        replace: true
        templateUrl: '/static/templates/feed_table.html'

    angular.module('rssler').directive('feedTable', -> new FeedTable)