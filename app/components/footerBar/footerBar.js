(function(){
	'use strict'
	angular.module('app.footerBar', [])
	.directive('footerBar', footerBarFn);
	function footerBarFn(){
		return {
			restrict: 'EA',
			templateUrl: 'components/footerBar/footerBar.html'
		}
	}
})();