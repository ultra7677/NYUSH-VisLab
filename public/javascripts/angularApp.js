/**
 * Created by ultra on 7/13/16.
 */
var app = angular.module('demoApp',['ui.router','LoginCtrl','MainpageCtrl']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('mainpage',{
                url:'/mainpage',
                templateUrl:'/templates/mainpage.html',
                controller: 'MainpageCtrl'
            });
        $stateProvider
            .state('login',{
                url:'/login',
                templateUrl:'/templates/login.html',
                controller:'LoginCtrl'
            });
        $urlRouterProvider.otherwise('login');
    }
]);


/*
 app.factory('posts',['$http',function($http){
 // service body
 var o = {
 posts: []
 };
 o.getAll = function() {
 return $http.get('/posts').success(function(data){
 angular.copy(data, o.posts);
 });
 };
 o.create = function(post) {
 return $http.post('/posts', post).success(function(data){
 o.posts.push(data);
 });
 };
 return o;
 }]);

 app.controller('MainCtrl',[
 '$scope',
 'posts',
 function($scope,posts){
 $scope.test = 'Hello world!';
 $scope.posts = posts.posts;

 $scope.addPost = function(){
 if(!$scope.title || $scope.title === '') { return; }

 posts.create({
 title: $scope.title,
 link: $scope.link,
 });

 $scope.title = '';
 $scope.link = '';

 }

 $scope.incrementUpvotes = function(post){
 post.upvotes += 1;
 }
 }
 ]);

 app.controller('PostsCtrl', [
 '$scope',
 '$stateParams',
 'posts',
 function($scope, $stateParams, posts){
 $scope.post = posts.posts[$stateParams.id];

 $scope.addComment = function(){
 if($scope.body === '') { return; }
 $scope.post.comments.push({
 body: $scope.body,
 author: 'user',
 upvotes: 0
 });
 $scope.body = '';
 };
 }
 ]);

 app.controller('MainpageCtrl',[
 '$scope',
 function ($scope) {

 }
 ]);

app.controller('DirectivesCtrl',[
    '$scope',
    function ($scope) {

    }
]);

app.controller('CustomersController', ['$scope', function ($scope) {
    var counter = 0;
    $scope.customer = {
        name: 'David',
        street: '1234 Anywhere St.'
    };

    $scope.customers = [
        {
            name: 'David',
            street: '1234 Anywhere St.'
        },
        {
            name: 'Tina',
            street: '1800 Crest St.'
        },
        {
            name: 'Michelle',
            street: '890 Main St.'
        }
    ];

    $scope.addCustomer = function () {
        counter++;
        $scope.customers.push({
            name: 'New Customer' + counter,
            street: counter + ' Cedar Point St.'
        });
    };

    $scope.changeData = function () {
        counter++;
        $scope.customer = {
            name: 'James',
            street: counter + ' Cedar Point St.'
        };
    };
}]);

*/