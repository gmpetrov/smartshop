'use strict';

angular.module('SmartShop')
    .directive('onLastRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$last){
				setTimeout(function(){
                	scope.$emit('onRepeatLast', element, attrs);
            	}, 1);
            }
        };
    })
	.controller('MainCtrl', function ($scope, $q, $http, toaster, zalando, asos, sarenza) {

		$scope.is_loaded = false;
		$scope.is_submitted = false;
		$scope.zalando_res = new Array();
		$scope.select_size = 0;
		$scope.select_sex = null;
		$scope.predicate = 'pricebox_text';
		$scope.tmp = new Array();

		$('#select_sex').on('change', function() {
				var scope = angular.element($("#select_sex")).scope();
				var newVal = this.value;
				scope.$apply(function(){
						scope.select_sex = newVal;
				});
		});

		$('#select_size').on('change', function() {
				var scope = angular.element($("#select_size")).scope();
				var newVal = this.value;
				scope.$apply(function(){
						scope.select_size = newVal;
				});
		});

		$scope.$on('onRepeatLast', function(scope, element, attrs){
          	$('.materialboxed').materialbox();
      	});

		$scope.submit = function(callback){
			if ($scope.select_sex === null){
				toaster.pop('error', "You have to select a gender", "");
				return ;
			}
			else if ($scope.select_size == 0){
				toaster.pop('error', "You have to select a size", "");
				return ;
			}
			$scope.is_submitted = true;
			$scope.zalando_res = null;

			$q.all([
				$q.when(zalando.get($scope)),
				$q.when(sarenza.get($scope)),
				$q.when(asos.get($scope))
			])
			.then(function(data){
				console.log('flute');
				$scope.end();
			});
		};

		$scope.end = function(){
			$scope.tmp.sort(function(a, b){
				return a['price'] - b['price'];
			});
			$scope.zalando_res = $scope.tmp;
			$scope.is_submitted = false;
			$scope.is_loaded = true;
			$scope.tmp = new Array();
		}

	});
