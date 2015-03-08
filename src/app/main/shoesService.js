angular.module('SmartShop')
.factory('shoes', ['$http' , function($http){
	return {
		get : function($scope){
			var SIZE = $scope.select_size - 35;
			var magic_url = 'https://api.import.io/store/data/_magic';
			return $http.post(magic_url, {
				apiVersionGuid: null,
				invalidatingCache: false,
				url: "http://www.shoes.fr/Basket-" + $scope.select_sex + "-st-10218-10157-0-taille-" + SIZE + ".php?classement=ASC"
			})
			.success(function(data){
				console.log('success_shoes');
				console.log(data);
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
					else if ('price_1/_source' in el)
						price = parseInt(/\d+,?\d+/.exec(el['price_1/_source']))
					else if ('price_2/_source' in el)
						price = parseInt(/\d+,?\d+/.exec(el['price_2/_source']))
					else if ('text_1' in el)
						price = parseInt(/\d+,?\d+/.exec(el['text_1']))
					else
						price = 42;


					if ('img_content_image' in el)
						var imgLink = el['img_content_image'];
					else if ('imagebox_image' in el)
						var imgLink = el['imagebox_image']
					else if ('image_1' in el)
						var imgLink = el['image_1']
					else if ('new_image' in el)
						var imgLink = el['new_image'];
					else if ('img_content_image' in el)
						var imgLink = el['img_content_image'];
					else if ('obf_image' in el)
						var imgLink = el['obf_image'];
					else
						var imgLink = 'flute';

					if ('brand_text' in el)
						var desc = el['brand_text'];
					else if ('image_1/_alt' in el)
						var desc = el['image_1/_alt'];
					else if ('imagebox_image/_alt' in el)
						var desc = el['imagebox_image/_alt'];
					else if ('img_content_image/_alt' in el)
						var desc = el['img_content_image/_alt']
					else if ('new_image/_alt' in el)
						var desc = el['new_image/_alt']
					else if ('obf_image/_alt' in el)
						var desc = el['obf_image/_alt'];
					else
						var desc = 'NAN';
					var obj = {
						'imagebox_image' : imgLink,
						'imagebox_image/_alt' : desc,
						'price' : price,
						'link_1' : el['link_1'],
						'from' : 'shoes',
						'is_asos' : false
					};
					$scope.tmp.push(obj);
				});
			})
			.error(function(){
				console.log('errror_shoes');
				return null;
			});
		}
	}
}]);