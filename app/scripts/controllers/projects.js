'use strict';

angular.module('tangentApp')
  .controller('ProjectsCtrl', function ($scope, $http, $cookies, $location, tokenFetch, $filter) {

    $scope.token;
    $scope.projects = [];
    $scope.addData = {
      title: "",
      description: "",
      start_date: null,
      end_date: null,
      is_billable: null,
      is_active: null
    };

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
        console.log($scope.token);
        $http.get(
          'http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': $scope.token
            }
          }).success(function(data, status, headers, config) {
          console.log(data);
          $scope.projects  = data;

        });
      }
    }

    $scope.clickAdd = function(){
      $('#ProjectAddModal').modal('show');
    }
    $scope.addProject = function(data){


      data.start_date =$filter('date')(new Date(data.start_date), "yyyy-MM-dd");
      data.end_date =$filter('date')(new Date(data.end_date), "yyyy-MM-dd");
      console.log(data);
      $http.post('http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/',data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': $scope.token
        }}).
      success(function (data, status, headers, config) {
        console.log(data);
        $scope.projects.push(data);
      }).error(function (error, status) {
        console.log(error);


      });
    }

    $scope.init();
  });
