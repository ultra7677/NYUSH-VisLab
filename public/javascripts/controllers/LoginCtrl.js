/**
 * Created by ultra on 7/18/16.
 */

var app = angular.module('LoginCtrl',[]);

app.controller('LoginCtrl',[
    '$scope',
    '$location',
    function ($scope,$location) {
        $scope.jumpToUrl = function(){
            $location.path('/mainpage');
        }
    }
]);