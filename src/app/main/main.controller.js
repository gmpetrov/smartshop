'use strict';

angular.module('SmartShop')
    .directive('onLastRepeat', function() {
        return function(scope, element, attrs) {
            if (scope.$last) setTimeout(function(){
                scope.$emit('onRepeatLast', element, attrs);
            }, 1);
        };
    })
	.controller('MainCtrl', function ($scope, $http, toaster) {

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

		$scope.submit = function(){
			if ($scope.select_sex === null){
				toaster.pop('error', "You have to select a gender", "");
				return ;
			}
			else if ($scope.select_size == 0){
				toaster.pop('error', "You have to select a size", "");
				return ;
			}
			$scope.tmp = new Array();
			$scope.zalando_res = new Array();
			$scope.is_submitted = true;
			var magic_url = 'https://api.import.io/store/data/_magic';
			$http.post(magic_url, {
				apiVersionGuid: null,
				invalidatingCache: false,
				url: "https://www.zalando.fr/baskets-" + $scope.select_sex + "/__taille-" + $scope.select_size + "/?order=price&dir=asc"
			})
			.success(function(data){
				console.log(data);
				var ar = new Array();
				var price;
				data.results.forEach(function(el){
					if ('pricebox_price/_source' in el)
						price = parseInt(/\d+,?\d+/.exec(el['pricebox_price/_source']))
					else if ('pricebox_text' in el)
						price = parseInt(/\d+,?\d+/.exec(el['pricebox_text']))
					else if ('pricebox_price/_source' in el)
						price = parseInt(/\d+,?\d+/.exec(el['pricebox_price/_source']))
					else if ('pricebox_price_list/_source' in el)
						price = parseInt(/\d+,?\d+/.exec(el['pricebox_price_list/_source']))
					else
						price = 42;
					var obj = {
						'imagebox_image' : el.imagebox_image,
						'imagebox_image/_alt' : el['imagebox_image/_alt'],
						'price' : price,
						'link_1' : el['link_1'],
						'from' : 'zalando',
						'is_asos' : false
					};
					$scope.tmp.push(obj);
					
				});
				$scope.getAsos();
				// $scope.zalando_res = ar;
				// $scope.zalando_res.sort(function(a, b){
				// 	return a['pricebox_price/_source'] - b['pricebox_price/_source'];
				// });
			})
			.error(function(){
				console.log('errror_fuck');
				$scope.is_submitted = false;
				$scope.is_loaded = true;
			});


			$scope.getAsos = function(){
				if ($scope.select_sex == 'femme')
					var asos_url = 'http://www.asos.fr/Femme-Chaussures/qt0ml/?cid=4172#parentID=-1&pge=0&pgeSize=36&sort=3';
				else
					var asos_url = 'http://www.asos.fr/Homme-Chaussures-bottes-baskets/x0bk0/?cid=4209#parentID=-1&pge=0&pgeSize=36&sort=3';
				$http.post(magic_url, {
					apiVersionGuid: null,
					invalidatingCache: false,
					url: asos_url
				})
				.success(function(data){
					// console.log(data);
					var ar = new Array();
					var price;
					data.results.forEach(function(el){
						// console.log(el);
						if ('pricebox_price/_source' in el)
							price = parseInt(/\d+,?\d+/.exec(el['pricebox_price/_source']))
						else if ('pricebox_text' in el)
							price = parseInt(/\d+,?\d+/.exec(el['pricebox_text']))
						else if ('pricebox_price/_source' in el)
							price = parseInt(/\d+,?\d+/.exec(el['pricebox_price/_source']))
						else if ('pricebox_price_list/_source' in el)
							price = parseInt(/\d+,?\d+/.exec(el['pricebox_price_list/_source']))
						else if ('productprice_text' in el)
							price = parseInt(/\d+,?\d+/.exec(el['productprice_text']));
						else
							price = 0;
						var obj = {
							'imagebox_image' : el['product_image_image'],
							'imagebox_image/_alt' : el['desc_link/_text'],
							'price' : price,
							'link_1' : el['desc_link'],
							'from' : 'asos',
							'is_asos' : true
						};
						$scope.tmp.push(obj);	
					});
					$scope.tmp.sort(function(a, b){
						return a['price'] - b['price'];
					});
					$scope.zalando_res = $scope.tmp;
					$scope.is_submitted = false;
					$scope.is_loaded = true;
				})
				.error(function(){
					$scope.is_submitted = false;
					$scope.is_loaded = true;
					console.log('errror_assos');
				});
			};
		};

	});
