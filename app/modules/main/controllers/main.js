MainCtrl.$inject = ['$scope', '$http'];
function MainCtrl($scope, $http) {
	$http({
		method: 'JSONP',
		url: 'https://54.148.133.7/pay2you-external/Info/GetTariffs?tarifftype=web&callback=JSON_CALLBACK'
	}).then(function successCallback(response) {
		console.log('successCallback', response);
	}, function errorCallback(response) {
		console.log('errorCallback', response);
	});
}

module.exports = MainCtrl;