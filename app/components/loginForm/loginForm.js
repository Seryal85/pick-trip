(function(){
	'use strict'
	angular.module('app.loginForm', [])
	.controller('LoginCtrl', function($scope, $location, $auth, $log) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          $log.success('You have successfully signed in!');
          $location.path('/');
        })
        .catch(function(error) {
          $log.error(error.data.message, error.status);
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          $log.success('You have successfully signed in with ' + provider + '!');
          $location.path('/');
        })
        .catch(function(error) {
          if (error.error) {
            // Popup error - invalid redirect_uri, pressed cancel button, etc.
            $log.error(error.error);
          } else if (error.data) {
            // HTTP response error from server
            $log.error(error.data.message, error.status);
          } else {
            $log.error(error);
          }
        });
    };
  });
})();