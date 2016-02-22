(function(){
	'use strict'
	angular.module('app.signUpPersonillizeForm', [])
		.config(function (LightboxProvider) {
			LightboxProvider.templateUrl = 'components/signUpPersonalizeForm/customLightBox.html';
		
			LightboxProvider.calculateImageDimensionLimits = function (dimensions) {
		    return {
		      'maxWidth': dimensions.windowWidth <= 768 ? // default
		        dimensions.windowWidth - 92 :
		        dimensions.windowWidth - 52,
		      'maxHeight': 600                           // custom
		    };
		  };
	})
	.controller('SignUpPersonillizeCtrl', [ '$scope', '$http', '$timeout','$log','Upload', 'Lightbox', function($scope, $http, $timeout, $log, Upload, Lightbox){

	$scope.howToSend = 1;
	$scope.avatarVisible =false;
	// $scope.file = null;

	$scope.$watch('file', function (file) {
    $scope.avatarVisible = false;
    if (file != null) {
        $log.debug('file != null');
        $scope.file = file;
        $scope.errorMsg = null;
        (function (f) {
          $log.debug('Update');
          $scope.upload(f, true);
          $scope.avatarVisible = true;
        })(file);

    }
  });

	  $scope.upload = function(file, resumable) {
	    $log.debug('$scope.upload');
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
	        $scope.avatarVisible = true;
	        file.result = response.data;
	        $log.debug(file);        
	        //Lightbox.openModal([file.$ngfBlobUrl], 0);
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