MainCtrl.$inject = ['$scope'];
function MainCtrl($scope) {
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