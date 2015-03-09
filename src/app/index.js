'use strict';

angular.module('SmartShop', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ngMaterial', 'toaster', 'angular-loading-bar'])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider) {
	// $httpProvider.defaults.useXDomain = true;
	// delete $httpProvider.defaults.headers.common['X-Requested-With'];
   cfpLoadingBarProvider.includeSpinner = false;
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: './app/templates/main/main.html',
        controller: 'MainCtrl'
      });
    $urlRouterProvider.otherwise('/');
  })
;
