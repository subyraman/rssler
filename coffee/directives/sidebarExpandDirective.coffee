do (angular=angular) ->
    class SidebarExpand
        restrict: 'A'
        link: @link

        link: (scope, element, attrs) -> 

            $(element).on 'click', '[data-toggle=offcanvas]',  ->
                element.toggleClass('sidebar-expanded')


    angular.module('rssler').directive('sidebarExpand', -> new SidebarExpand)