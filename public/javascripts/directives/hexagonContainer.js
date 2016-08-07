/**
 * Created by ultra on 7/17/16.
 */

angular.module('demoApp').directive("hexagonContainer", function($window,$http) {
    return{
        restrict: "EA",
        template: "",
        link: function(scope, elem, attrs){

            var canvasContainer = 'hexagon-chart';

/*
            hexagon
                .size([$(window).width()*0.95,800])
                .init(canvasContainer)
                .render();
*/


/*
            playground
                .size([$(window).width()*0.95,800])
                .init(canvasContainer)
                .animate();
*/

            $http.get('/data/binList')
                .success(function(success){
                    //console.log(success);
                    simpleHex
                        .size([$(window).width()*0.95,670])
                        .binList_data(success)
                        .init(canvasContainer);
                });

        }
    };
});