(function(){
	'use strict'
	angular.module('app.navBar', [])
	.directive('navBar', navBarFn);
	function navBarFn(){
		return {
			restrict: 'EA',
			templateUrl: 'components/navBar/navBar.html'
		}
	}
})();