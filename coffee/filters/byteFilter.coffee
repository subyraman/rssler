do (angular=angular) ->
    class ByteFilter
        constructor: () ->
            return (bytes) =>
                return @filter(bytes)

        filter: (bytes, precision) ->
            if isNaN(parseFloat(bytes)) or not isFinite(bytes)
                return '-'

            if typeof precision == 'undefined'
                precision = 1

            units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB']
            number = Math.floor(Math.log(bytes) / Math.log(1024))

            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];


    angular.module('rssler').filter('byteFilter', -> new ByteFilter())