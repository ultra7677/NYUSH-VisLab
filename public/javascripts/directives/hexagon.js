/**
 * Created by ultra on 7/17/16.
 */

angular.module('demoApp').directive("hexagon", function($window) {
    return{
        restrict: "EA",
        template: "<div id='chart'></div>",
        link: function(scope, elem, attrs){
           // console.log(hexagon);
            hexagon.init();
        }
    };
});