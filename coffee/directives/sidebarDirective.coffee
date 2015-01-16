do (angular=angular) ->
    
    class Sidebar
        restrict: 'E'
        replace: true
        templateUrl: '/static/templates/sidebar.html'

    angular.module('rssler').directive('sidebar', -> new Sidebar)