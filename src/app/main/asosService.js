angular.module('SmartShop')
.factory('asos', ['$http', function($http){
	return {
		get : function($scope){
			if ($scope.select_sex == 'femme')
				var asos_url = 'http://www.asos.fr/Femme-Chaussures/qt0ml/?cid=4172#parentID=-1&pge=0&pgeSize=36&sort=3';
			else
				var asos_url = 'http://www.asos.fr/homme-chaussures-bottes-baskets/x0bk0/?cid=4209&via=top#state=Rf-300%3D2323&parentID=-1&pge=0&pgeSize=36&sort=3';
			var magic_url = 'https://api.import.io/store/data/_magic';
			return $http.post(magic_url, {
				apiVersionGuid: null,
				invalidatingCache: false,
				url: asos_url
			})
			.success(function(data){
				// console.log(data);
				console.log('success_asos');
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
			})
		.error(function(){
			$scope.is_submitted = false;
			$scope.is_loaded = true;
			console.log('error_assos');
		});


		}
	}
}]);