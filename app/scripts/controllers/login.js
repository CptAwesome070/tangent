'use strict';

angular.module('tangentApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, tokenFetch, $location) {

    $scope.creds = {
      username: "",
      password: ""
    };

    $scope.token = "";
    $scope.errors = "";

    /* initial scope loading function */
    $scope.init = function(){
      $scope.token = tokenFetch.getToken();
      if($scope.token != undefined){
        $location.url('/projects');
      }
    }
    /* login function */
    $scope.authLogin = function(creds){
      var formdata = {
        username: creds.username,
        password: creds.password
      }
      $http.post('http://userservice.staging.tangentmicroservices.com:80/api-token-auth/',formdata).
      success(function (data, status, headers, config) {
        console.log(data.token);
        $scope.token = data.token;
        $cookies.put('token', data.token);
        $location.url('/projects');



      }).error(function (error, status) {
        // to toast error

      });
    }
    /* call to init function */
    $scope.init();
  });
