do (angular=angular) ->
    class SlideDown
        restrict: 'A'
        link: @link
        scope:
            isOpen: '=slideToggle'
            category: '=category'

        link: (scope, element, attrs) -> 
            slideDuration = parseInt(attrs.slideToggleDuration, 10) or 200

            scope.$watch 'category.expanded', (newVal,oldVal) =>
                if (newVal != oldVal)
                    element.stop().slideToggle(slideDuration)


    angular.module('rssler').directive('slideDown', -> new SlideDown)