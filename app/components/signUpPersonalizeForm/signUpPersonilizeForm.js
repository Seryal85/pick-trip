(function(){
	'use strict'
	angular.module('app.signUpPersonillizeForm', [])
		.controller('SignUpPersonillizeCtrl', [ '$scope', '$http', '$timeout','Upload', function($scope, $http, $timeout, Upload){

	$scope.howToSend = 1;
	$scope.invalidFiles = [];

	$scope.$watch('files', function (files) {
    $scope.formUpload = false;
    if (files != null) {
      if (!angular.isArray(files)) {
        $timeout(function () {
          $scope.files = files = [files];
        });
        return;
      }
      for (var i = 0; i < files.length; i++) {
        $scope.errorMsg = null;
        (function (f) {
          $scope.upload(f, true);
        })(files[i]);
      }
    }
  });

	  $scope.upload = function(file, resumable) {
	    $scope.errorMsg = null;
	    if ($scope.howToSend === 1) {
	      uploadUsingUpload(file, resumable);
	    } else if ($scope.howToSend == 2) {
	      uploadUsing$http(file);
	    } else {
	      uploadS3(file);
	    }
	  };

	    $scope.getReqParams = function () {
    	return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
    	'&errorMessage=' + $scope.serverErrorMsg : '';
  		};

	  function uploadUsingUpload(file, resumable) {
	    file.upload = Upload.upload({
	      url: 'https://angular-file-upload-cors-srv.appspot.com/upload' + $scope.getReqParams(),
	      resumeSizeUrl: resumable ? 'https://angular-file-upload-cors-srv.appspot.com/upload?name=' + encodeURIComponent(file.name) : null,
	      resumeChunkSize: resumable ? $scope.chunkSize : null,
	      headers: {
	        'optional-header': 'header-value'
	      },
	      data: {username: $scope.username, file: file}
	    });

	    file.upload.then(function (response) {
	      $timeout(function () {
	        file.result = response.data;
	      });
	    }, function (response) {
	      if (response.status > 0)
	        $scope.errorMsg = response.status + ': ' + response.data;
	    }, function (evt) {
	      // Math.min is to fix IE which reports 200% sometimes
	      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	    });

	    file.upload.xhr(function (xhr) {
	      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
	    });
 	 }


	}])

})();