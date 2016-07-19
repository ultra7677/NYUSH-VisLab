/**
 * Created by ultra on 7/17/16.
 */

angular.module('demoApp').directive("hexagon", function($window) {
    return{
        restrict: "EA",
        template: "<div id='chart'></div>",
        link: function(scope, elem, attrs){

            var canvasContainer = 'chart';

            hexagon
                .size([$(window).width()*0.95,800])
                .init(canvasContainer)
                .render();
        }
    };
});