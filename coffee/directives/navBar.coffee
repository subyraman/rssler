do (angular=angular) ->
    class Navbar
        restrict: 'E'
        replace: true
        templateUrl: '/static/templates/nav_bar.html'

    angular.module('rssler').directive('navBar', -> new Navbar)