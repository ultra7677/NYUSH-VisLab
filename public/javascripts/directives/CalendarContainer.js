/**
 * Created by ultra on 7/26/16.
 */
angular.module('demoApp').directive('calendarContainer',function ($window){
    return {
        restrict: "EA",
        template: '<link rel="stylesheet" href="/stylesheets/calendar.css" media="screen" type="text/css" />' +
        '<div id="wrapper">' +
        '<div class = "drp-popup">' +
        '<div class = "drp-calendars">' +
        '<div class = "drp-calendar drp-calendar-start">' +
        '<div class = "drp-month-picker">' +
        '<div class = "drp-arrow"><</div>' +
        '<div class = "drp-month-title"> </div>' +
        '<div class = "drp-arrow drp-arrow-right">></div>' +
        '</div>' +
        '<ul class = "drp-day-headers"> </ul>' +
        '<ul class = "drp-days"> </ul>' +
        '<div/>' +
        '<div class = "drp-calendar-date"> </div>' +
        '</div>' +
        '</div>' +
        '</div>'
        ,
        link: function (scope, elem, attrs) {

            var currentDate;
            currentDate = new Date();

            var calendar = new Calendar($('.drp-calendar:first-child'),currentDate,$window);
            calendar.draw();
        }
    }
});