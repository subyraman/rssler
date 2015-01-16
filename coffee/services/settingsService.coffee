do (angular=angular) ->
    class SettingsService
        constructor: (@$http) ->
            @currentArticle = {}

        sendOPML: (data) ->
            @$http.post('/opml', data)

        getDBSize: ->
            @$http.get('/db/size')

    angular.module('rssler').service 'settingsService', ['$http', SettingsService]