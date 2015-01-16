do (angular=angular) ->
    class ViewService
        constructor: ->
            @currentView = {data: null}
            @visible = {feedView: true, articleView: false}
            @loadingStatus = {isLoading: false}


    angular.module('rssler').service 'viewService', ViewService