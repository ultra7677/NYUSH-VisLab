/**
 * Created by ultra on 7/28/16.
 */
var app = angular.module('HexagonCtrl',[]);

app.controller('HexagonCtrl',[
    '$scope',
    '$stateParams',
    function ($scope,$stateParams) {
        console.log($stateParams);
    }
]);

