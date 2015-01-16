do (angular=angular) ->
    class NavController
        constructor: (@$modal, @viewService) ->
            @loadingStatus = @viewService.loadingStatus

        openSettings: ->
            @$modal.open
                templateUrl: '/static/templates/settings_modal.html'
                size: 'lg'
                controller: 'SettingsController'
                controllerAs: 'settingsCtrl'

    angular.module('rssler').controller('NavController', ['$modal', 'viewService', NavController])