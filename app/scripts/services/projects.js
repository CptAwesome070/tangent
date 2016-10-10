'use strict';

angular.module('tangentApp')
  .service('projectService',function($http, tokenFetch) {
      var endpoint = 'http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/';
      this.getAll= function() {
        return $http.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': tokenFetch.getToken()
          }});
      },
      this.get=  function(id) {

      },
      this.add= function(data){
        return $http.post(endpoint,data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': tokenFetch.getToken()
          }});
      },
      this.delete = function(pk){
        return $http.delete('http://projectservice.staging.tangentmicroservices.com:80/api/v1/projects/'+pk+'/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': tokenFetch.getToken()
          }})
      },
      this.edit= function(data, pk){
        return $http.put(endpoint+pk+'/',data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': tokenFetch.getToken()
          }});
      }
  });
