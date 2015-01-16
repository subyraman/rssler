do (angular=angular) ->
    class DateFilter
        constructor: (@$filter) ->
            return (inputDate) =>
                return @filter(inputDate)

        isYesterday: (timestamp) ->
            tsToDate = new Date(timestamp)
            compDate = new Date(tsToDate.getFullYear(), tsToDate.getMonth(), tsToDate.getDate())
            now = new Date()
            yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)

            return compDate <= yesterday

        isLastYear: (timestamp) ->
            articleYear = new Date(timestamp).getFullYear()
            nowYear = new Date().getFullYear()

            return articleYear < nowYear

        filter: (inputDate) ->
            $ngDateFilter = @$filter('date')
            timestamp = Date.parse(inputDate)

            if @isLastYear(timestamp)
                return $ngDateFilter(timestamp, 'MM/dd/yy')

            if @isYesterday(timestamp)
                return $ngDateFilter(timestamp, 'MM/dd h:mm a')

            return $ngDateFilter(timestamp, 'shortTime')


    angular.module('rssler').filter('dateFilter', ['$filter', ($filter) -> new DateFilter($filter)])