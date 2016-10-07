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
    $scope.selProject = null;

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
          angular.forEach(data, function(d){
            if(d.task_set.length >0){
              angular.forEach(d.task_set, function(ts){
                if(ts.due_date != null){
                  ts.due_date = new Date(ts.due_date);
                }
                else{
                  ts.due_date = undefined;
                }

              });
            }
          });
          console.log(data);
          $scope.projects  = data;
        });
      }
    }

    /* add project function */

    $scope.clickAdd = function(){
      $('#ProjectAddModal').modal('show');
    }
    $scope.addProject = function(data){
      data.start_date =$filter('date')(new Date(data.start_date), "yyyy-MM-dd");
      data.end_date =$filter('date')(new Date(data.end_date), "yyyy-MM-dd");
      if(data.is_billable == null){
        data.is_billable = false;
      }
      if(data.is_active == null){
        data.is_active = false;
      }
      console.log(data);
      $http.post('http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/',data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': $scope.token
        }}).
      success(function (data, status, headers, config) {
        console.log(data);
        $scope.projects.push(data);
        $('#ProjectAddModal').modal('hide');
      }).error(function (error, status) {
        console.log(error);
      });
    }

    $scope.clickView = function(project){
      $scope.selProject = project;
      $('#ProjectViewModal').modal('show');
    }

    /* Project Delete */

    $scope.clickDelete = function(p){
      $scope.selProject = p;
      $('#ProjectDeleteModal').modal('show');
    }

    $scope.delProject= function(){
      var ind = $scope.projects.indexOf($scope.selProject);

      $http.delete('http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/'+$scope.selProject.pk+'/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': $scope.token
        }}).
      success(function (data, status, headers, config) {
        console.log(data);
        $scope.projects.splice(ind, 1);
        $scope.selProject = null;
        $('#ProjectDeleteModal').modal('hide');
      }).error(function (error, status) {
        console.log(error);
      });
    }


    $scope.init();
  });
