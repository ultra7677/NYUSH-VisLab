/**
 * Created by ultra on 7/18/16.
 */

var app = angular.module('LoginCtrl',[]);

app.controller('LoginCtrl',[
    '$scope',
    '$location',
    '$http',
    function ($scope,$location,$http) {
        $scope.login = function(){

            var authForm = {};
            authForm.username = $scope.username;
            authForm.password = $scope.password;

            console.log(authForm);

            $http.post('/auth/login',authForm)
                .success(function(success){
                    console.log(success);
                    if (success.status == 0){
                        $location.path('/mainpage');
                    } else {
                        alert("invalid password or username");
                    }
                });

         //   $location.path('/mainpage');
        }

        $scope.register = function(){
            var authForm = {};
            authForm.username = $scope.username;
            authForm.password = $scope.password;

            console.log(authForm);
            $http.post('/auth/register',authForm)
                .success(function(success){
                    if (success.status == 0){
                        alert("registration success");
                    } else {
                        alert("exist username");
                    }
                });

        }

    }
]);