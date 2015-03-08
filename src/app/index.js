'use strict';

angular.module('SmartShop', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ngMaterial', 'toaster'])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
	// $httpProvider.defaults.useXDomain = true;
	// delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: './app/templates/main/main.html',
        controller: 'MainCtrl'
      });
    $urlRouterProvider.otherwise('/');
  })
;
