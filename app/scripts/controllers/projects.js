'use strict';

angular.module('tangentApp')
  .controller('ProjectsCtrl', function ($scope, $http, $cookies, $location, tokenFetch, $filter, $route, projectService) {

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
      $scope.token = tokenFetch.getToken();
      if($scope.token == undefined){
        $location.url('/login');
      }
      else{
        projectService.getAll().then(function(data){
          angular.forEach(data.data, function(d){
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
          $scope.projects  = data.data;
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

      if(data.end_date == "1970-01-01"){
        data.end_date = null;
      }

      if(data.is_billable == null){
        data.is_billable = false;
      }
      if(data.is_active == null){
        data.is_active = false;
      }
      projectService.add(data).then(function(raw){
        var newdata = raw.data;
        if(newdata.due_date != null){
          newdata.due_date = new Date(newdata.due_date);
        }
        else{
          newdata.due_date = undefined;
        }
        $scope.projects.push(newdata);
        $('#ProjectAddModal').modal('hide');
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
      projectService.delete($scope.selProject.pk).then(function(data){
        $scope.projects.splice(ind, 1);
        $scope.selProject = null;
        $('#ProjectDeleteModal').modal('hide');
      });
    }


    /* edit project function */

    $scope.clickEdit = function(p){
      p.start_date = new Date(p.start_date);
      p.end_date = new Date(p.end_date);

      $scope.selProject = p;
      $('#ProjectEditModal').modal('show');
    }

    $scope.editProject = function(data){
      data.start_date =$filter('date')(new Date(data.start_date), "yyyy-MM-dd");
      data.end_date =$filter('date')(new Date(data.end_date), "yyyy-MM-dd");
      if(data.end_date == "1970-01-01"){
        data.end_date = null;
      }
      if(data.is_billable == null){
        data.is_billable = false;
      }
      if(data.is_active == null){
        data.is_active = false;
      }
      var ind = $scope.projects.indexOf($scope.selProject);

      projectService.edit(data,data.pk).then(function(data){
          $scope.projects[ind] = data.data;
          $('#ProjectEditModal').modal('hide');
          $scope.selProject = null;
        });
    }

    /* View project */

    $scope.clickView = function(project){

      $scope.selProject = project;

      $('#ProjectViewModal').modal('show');
    }

    $scope.init();
  });
