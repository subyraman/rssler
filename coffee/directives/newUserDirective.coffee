do (angular=angular) ->
    class NewUser
        restrict: 'E'
        replace: true
        templateUrl: '/static/templates/new_user.html'

    angular.module('rssler').directive('newUser', -> new NewUser)