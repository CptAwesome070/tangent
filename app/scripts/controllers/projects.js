'use strict';

angular.module('tangentApp')
  .controller('ProjectsCtrl', function ($scope, $http, $cookies, $location, tokenFetch) {

    $scope.token;
    $scope.projects;

    /* initial scope loading function, checks if the token is still valid in the cookie, and not yet expired */
    $scope.init = function(){
      $scope.token = tokenFetch.getToken();
      if($scope.token == undefined){
        $location.url('/login');
      }else{
        $scope.getProjects();
      }
    };

    $scope.getProjects = function(){
      // confirm that the token is still valid
      $scope.token = tokenFetch.getToken();
      if($scope.token == undefined){
        $location.url('/login');
      }
      else{
        $http.get(
          'http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': $scope.token
            }
          }).
        success(function(data, status, headers, config) {
          console.log(data);

        });
      }
    }

    $scope.init();
  });
