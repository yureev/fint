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

	$scope.checkNumber = function (ctrl) {
		if (ctrl.$valid && ctrl.$modelValue.length == 16) {
			return true;
		}
	};
	$scope.checkMonth = function (ctrl) {
		if (ctrl.$valid && ctrl.$modelValue.length == 2) {
			return true;
		}
	};
	$scope.checkYear = function (ctrl) {
		if (ctrl.$valid && ctrl.$modelValue.length == 2) {
			return true;
		}
	};
	$scope.checkCvc = function (ctrl) {
		if (ctrl.$valid && ctrl.$modelValue.length == 3) {
			return true;
		}
	};
	$scope.checkPhone = function (ctrl) {
		if (ctrl.$valid && ctrl.$modelValue.length == 9) {
			return true;
		}
	};
}

module.exports = MainCtrl;