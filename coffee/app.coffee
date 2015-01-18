do (angular=angular) ->
    rssler = angular.module 'rssler', ['ngRoute', 'ui.select', 'ngSanitize', 'ui.bootstrap']

    rssler.config ($routeProvider, $locationProvider) ->
        $routeProvider.when '/',
            controller: 'MainController'
            controllerAs: 'mainCtrl'
            templateUrl: '/static/templates/main.html'

        $locationProvider.html5Mode(true)

    rssler.config (datepickerConfig, datepickerPopupConfig) ->
        datepickerConfig.showWeeks = false
        datepickerPopupConfig.closeText = "Close"

    _.mixin replaceArray: (oldArray, newArray) ->
        oldArray.length = 0
        oldArray.push.apply(oldArray, newArray)

        return oldArray

    _.mixin uniqCollection: (collection) ->
        uniqified = _.uniq collection, (item, key, id)  ->
            return item.id

        return uniqified