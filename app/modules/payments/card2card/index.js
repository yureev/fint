require('./index.sass');

angular.module('card2card', [
	require('component-payments'),
	require('_modules/components/currency')
])
	.directive('card2card', card2cardDirective);

module.exports = 'card2card';

function card2cardDirective() {
	return {
		restrict: 'A',
		link: postLink,
		controller: ['$scope', '$http', Ctrl],
		controllerAs: 'vm',
		template: require('./templates/main.html')
	};

	function postLink(scope, element, attrs) {
		element.addClass('card2card');

		scope.$watch('c2cForm', function() {
			window.c2cForm = scope.c2cForm;
		})
	}

	function Ctrl($scope, $http) {
		var config = $scope.config = {
			tariff: null,
			tariffType: 'other'
		};

		$http({
			method: 'GET',
			url: require('_data/old/tariffs.json')
		}).then(function (response) {
			var data = response.data;

			angular.forEach(data, function (tariff) {
				if (tariff.card_type == config.tariffType) {
					config.tariff = tariff;
				}
			});
		});

		this.calculate = function () {
			$scope.commiss = Math.round($scope.amount * config.tariff.comm_percent + config.tariff.comm_fixed);

			if ($scope.commiss < config.tariff.total_min) {
				$scope.commiss = config.tariff.total_min / 100;
			} else if ($scope.commiss > config.tariff.total_max) {
				$scope.commiss = config.tariff.total_max / 100;
			} else if (!!$scope.commiss) {
				$scope.commiss /= 100;
			} else {
				$scope.commiss = 0;
			}

			$scope.total = $scope.amount + $scope.commiss;
		};
	}
}