do (angular=angular) ->

    class EditDropdown
        restrict: 'E'
        replace: true
        templateUrl: '/static/templates/edit_dropdown.html'

    angular.module('rssler').directive('editDropdown', -> new EditDropdown)