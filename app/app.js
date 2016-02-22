(function(){
	'use strict';

	angular.module('app',['ui.router', 'satellizer', 'ngMessages','ngFileUpload','bootstrapLightbox', 'ngImgCrop','app.navBar', 'app.footerBar', 'app.loginForm', 'app.signUpForm', 'app.signUpPersonillizeForm'])
	.config(function($stateProvider, $urlRouterProvider, $authProvider){

		$urlRouterProvider.otherwise("/")

		$stateProvider
			.state('home',{
				url: "",
				views : {
					"navigate" : {
							templateUrl : "components/navBar/login.html"
					}
				}
			})
			.state('login', {
				url: "/login",
				views : { "form" :
					{
						templateUrl: "components/loginForm/loginForm.html",
						controller: 'LoginCtrl',
						resolve: {
			 						skipIfLoggedIn: skipIfLoggedIn
			 					 }
					},
					"navigate":{
						templateUrl: "components/navBar/signUp.html"
					}
			 	}
			})
			.state('sign-up', {
				url: "/sign-up",
				views : { "form" :
					{
						templateUrl: "components/signUpForm/signUpForm.html",
						controller : 'SignUpCtrl',
						resolve: {
			 						skipIfLoggedIn: skipIfLoggedIn
			 					 }
					},
					"navigate":{
						templateUrl: "components/navBar/login.html"
					}
			 	}
			})
			.state('personalize-sign-up',{
				url: "/personalize-sign-up",
				views : {
					"form" : {
							templateUrl : "components/signUpPersonalizeForm/signUpPersonalizeForm.html",
							controller : 'SignUpPersonillizeCtrl',
							resolve: {
									skipIfLoggedIn: skipIfLoggedIn
							}
					},
					"navigate":{
						templateUrl: "components/navBar/login.html"
					}			
				}
			});

			$authProvider.facebook({
      		clientId: '230149480652480'
    		});

    		$authProvider.google({
      			clientId: '759656913857-2cps645c2teosus9um0ckp4e79djng54.apps.googleusercontent.com'
    		});

    		$authProvider.twitter({
      			url: '/auth/twitter'
    		});

    		function skipIfLoggedIn($q, $auth) {
      			var deferred = $q.defer();
			      if ($auth.isAuthenticated()) {
			        deferred.reject();
			      } else {
			        deferred.resolve();
			      }
			      return deferred.promise;
    		}
	});

})();