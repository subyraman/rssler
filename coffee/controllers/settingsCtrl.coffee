do (angular=angular) ->
    class SettingsController
        constructor: (@$modalInstance, @settingsService, @categoryService) ->
            @opmlAlerts = []

            @willDownload =
                msg: "Feed articles will be downloaded shortly."
                type: 'success'

            @settingsService.getDBSize()
                .then (response) =>
                    @dbSize = response.data.size

        submit: ->
            f = document.getElementById('file').files[0]

            if not f
                _.replaceArray(@opmlAlerts, [
                    msg: 'No file selected.'
                    type: 'danger'
                ])
                return

            r = new FileReader()

            r.onloadend = (e) =>
                data = e.target.result;
                @settingsService.sendOPML({'opml': data})
                    .then (response) =>
                        @replaceAlerts(response)
                        @categoryService.getCategories()
                    .catch (response) =>
                        @replaceAlerts(response)
           
            r.readAsBinaryString(f);

        replaceAlerts: (response) ->
            _.replaceArray(@opmlAlerts, [response.data])

            if response.data.type is "success" or response.data.type is "warning"
                @opmlAlerts.push(@willDownload)


        closeAlert: (alert) -> _.remove(@opmlAlerts, alert)

        close: -> @$modalInstance.close()


    angular.module('rssler').controller('SettingsController', ['$modalInstance', 'settingsService', 'categoryService', SettingsController])