do (angular=angular) ->
    class LoadingScreen
        restrict: 'A'
        link: @link
        scope:
            hasLoaded: '=hasLoaded'

        link: (scope, element, attrs) -> 
            scope.$watch 'hasLoaded', (newVal,oldVal) =>
                if (newVal)
                    element.delay(1000).fadeOut()


    angular.module('rssler').directive('loadingScreen', -> new LoadingScreen)