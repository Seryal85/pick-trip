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
	.factory('Data', function(){
    var data =
        {
            file: undefined,
            blob: undefined
        };
    
    return {
        getFile: function () {
            return data.file;
        },
        setFile: function (file) {
            data.file = file;
        },
        getBlob: function () {
            return data.blob;
        },
        setBlob: function (blob) {
            data.blob = blob;
        }
    };
	})	
	.controller('SignUpPersonillizeCtrl', [ '$scope', '$http', '$timeout','$log','Upload', 'Lightbox', 'Data', function($scope, $http, $timeout, $log, Upload, Lightbox, Data){

	$scope.howToSend = 1;
	$scope.avatarVisible =false;
	$scope.fileSrc = '';
	// $scope.file = null;
	

	$scope.$watch(function () { return Data.getBlob(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
        	$log.debug('watcher 2')
        	$log.debug(oldValue);
        	$log.debug(newValue);
        	$scope.fileSrc = Data.getBlob();
        }
    });

	$scope.$watch('file', function (newFile, oldFile) {
    $log.debug('watcher 1')
    $scope.avatarVisible = false;
    if(newFile !== oldFile)
    {
    	if (newFile != null) {    	
    	$scope.avatarVisible = true;
    	$log.debug(oldFile);
    	$log.debug(newFile);
    	Data.setFile(newFile);               	    
    	//$scope.file = Data.getFile();   	
	    Lightbox.openModal([''], 0);	        
	      
        
        
        
        //$scope.file = file;      
        
        //$scope.errorMsg = null;
        // (function (f) {
        //   $scope.upload(f, true);
        //   $scope.avatarVisible = true;
        // })(file);

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
	      data: {file: file}
	    });
	    

	    file.upload.then(function (response) {
	      $timeout(function () {
	        //file.result = response.data;
	        //$log.debug(response.data);
	        
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
	.controller('LightboxCtrl', ['$scope', '$log', '$timeout','Upload', 'Data', function ($scope, $log, $timeout, Upload,Data) {
		    
    		var URL = window.URL || window.webkitURL;
    		var srcTmp = URL.createObjectURL(Data.getFile());
        	$scope.myImage=srcTmp;
    		$scope.myCroppedImage='';
        	$scope.upload = function (dataUrl) {
        	 	//$log.debug(dataUrl);
        	 	//$log.debug(Upload.urlToBlob(dataUrl));
        	 	Data.setBlob(dataUrl);
        	 	Upload.urlToBlob(dataUrl).then(function(blob) {
        	 		
        	 		var file = new File([blob], "croped");
        	 		//$log.debug(blob);
        	 		 Data.setFile(file);
        	 		 //$log.debug(Data);
        	 	});
        	}
        	//$log.debug();
    		//$log.debug(Data.getFile());
    		// $log.debug($scope.myCroppedImage);
 }])

})();