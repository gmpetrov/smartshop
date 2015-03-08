angular.module('SmartShop')
.factory('zalando', ['$http' , function($http){
	return {
		get : function($scope){
			var magic_url = 'https://api.import.io/store/data/_magic';
			return  $http.post(magic_url, {
				apiVersionGuid: null,
				invalidatingCache: false,
				url: "https://www.zalando.fr/baskets-" + $scope.select_sex + "/__taille-" + $scope.select_size + "/?order=price&dir=asc"
			})
			.success(function(data){
				console.log('success_zalando');
				// console.log(data);
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
					// return $scope.tmp;
				});
			})
			.error(function(){
				console.log('errror_zalando');
				return null;
			});
		}
	}
}]);