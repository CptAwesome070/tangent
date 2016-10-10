'use strict';

angular.module('tangentApp')
  .factory('tokenFetch',function($cookies) {
    return {
      getToken: function () {
        return $cookies.get('token');
      }
    }
  })
