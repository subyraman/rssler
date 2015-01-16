do (angular=angular) ->
    rssler = angular.module 'rssler', ['ngRoute', 'ui.select', 'ngSanitize', 'ui.bootstrap']

    rssler.config ($routeProvider, $locationProvider) ->
        $routeProvider.when '/settings',
            controller: 'SettingsController'
            controllerAs: 'settingsCtrl'
            templateUrl: '/static/templates/settings.html'
            title: "Settings"

        $routeProvider.when '/',
            controller: 'MainController'
            controllerAs: 'mainCtrl'
            templateUrl: '/static/templates/main.html'
            title: "Raman RSS"

        $locationProvider.html5Mode(true)


    rssler.run ['$location', '$rootScope', ($location, $rootScope) ->
        $rootScope.$on('$routeChangeSuccess', (event, current, previous) ->

            if current.$$route
                title = current.$$route.title
            else
                title = "Raman RSS"

            document.title = title
        )
    ]

    rssler.config (datepickerConfig, datepickerPopupConfig) ->
        datepickerConfig.showWeeks = false
        datepickerPopupConfig.closeText = "Close"

    _.mixin replaceArray: (oldArray, newArray) ->
        oldArray.length = 0
        oldArray.push.apply(oldArray, newArray)

        return oldArray