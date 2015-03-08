angular.module('SmartShop')
.factory('sarenza', ['$http' , function($http){
	return {
		get : function($scope){
			var GENDER = ($scope.select_sex === 'femme' ? 'Woman' : 'Man');
			var magic_url = 'https://api.import.io/store/data/_magic';
			return $http.post(magic_url, {
				apiVersionGuid: null,
				invalidatingCache: false,
				url: "http://www.sarenza.com/Home" + GENDER + ".aspx?req=fh_location%25253d%25252f%25252fcatalog01%25252ffr_FR%25252fglobalvisibility%25253d%25257b1%25257d%25252fluxe%25253e%25257b0%25253b1%25257d%25252fmultigender%25253e%25257b2%25257d%25252fnewfhsarenzasize%25253e%25257b" + $scope.select_size + "%25257d%25252fpays%25253d%25257bfr%25257d%25252ftype%25253e%25257b76%25257d%252526fh_reffacet%25253dnewfhsarenzasize%252526fh_refpath%25253dfacet_13%252526fh_refview%25253dlister%252526fh_sort_by%25253d%252bsellingprice%252526fh_start_index%25253d0%252526fh_view_size%25253d99%252526sar_version%25253dv2r&products=true&isSelectionEngine=1&genderId=2&implicitcriterion=%7b%22multigender%22%3a%7b%22Name%22%3a%22multigender%22%2c%22Values%22%3a%5b%222%22%5d%2c%22IsMulti%22%3atrue%2c%22IsInvert%22%3afalse%7d%2c%22luxe%22%3a%7b%22Name%22%3a%22luxe%22%2c%22Values%22%3a%5b%220%22%2c%221%22%5d%2c%22IsMulti%22%3atrue%2c%22IsInvert%22%3afalse%7d%2c%22globalvisibility%22%3a%7b%22Name%22%3a%22globalvisibility%22%2c%22Values%22%3a%5b%221%22%5d%2c%22IsMulti%22%3afalse%2c%22IsInvert%22%3afalse%7d%2c%22pays%22%3a%7b%22Name%22%3a%22pays%22%2c%22Values%22%3a%5b%22fr%22%5d%2c%22IsMulti%22%3afalse%2c%22IsInvert%22%3afalse%7d%7d"
			})
			.success(function(data){
				console.log('success_sarenza');
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
					else
						price = 42;

					if ('img_content_image/_alt' in el)
						var imgLink = el['img_content_image/_alt'];
					else if ('imagebox_image' in el)
						var imgLink = el['imagebox_image']
					else if ('image_1' in el)
						var imgLink = el['image_1']
					else if ('new_image' in el)
						var imgLink = el['new_image'];
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
					else
						var desc = 'NAN';
					var obj = {
						'imagebox_image' : imgLink,
						'imagebox_image/_alt' : desc,
						'price' : price,
						'link_1' : el['link_1'],
						'from' : 'sarenza',
						'is_asos' : false
					};
					$scope.tmp.push(obj);
					// return $scope.tmp;
				});
			})
			.error(function(){
				console.log('errror_sarenza');
				return null;
			});
		}
	}
}]);