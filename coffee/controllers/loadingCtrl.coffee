do (angular=angular) ->
    class LoadingController
        constructor: (@$scope, @categoryService, @feedService) ->
            @hasLoaded = false

            @loaded_percent = () ->
                loaded = 0
                if @categoryService.hasLoaded
                    loaded +=1
                if @feedService.hasLoaded
                    loaded +=1

                if loaded == 2
                    @hasLoaded = true

                return loaded



    angular.module('rssler').controller('LoadingController', ['$scope', 'categoryService', 'feedService', LoadingController])