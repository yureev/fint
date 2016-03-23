require('./index.sass');

angular.module('card2card', [
	require('component-payments'),
	require('_modules/components/currency')
])
	.directive('card2card', card2cardDirective)
	.directive('card2cardInput', card2cardInputDirective)
	.directive('card2cardError', card2cardErrorDirective);

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
	}

	function Ctrl($scope, $http) {
		var config = $scope.config = {
			tariff: null,
			tariffType: 'other'
		};

		$http.jsonp('https://send.ua/sendua-external/Info/GetTariffs?tarifftype=web&callback=JSON_CALLBACK')
			.then(function(response) {
				var data = response.data;

				angular.forEach(data, function (tariff) {
					if (tariff.card_type == config.tariffType) {
						config.tariff = tariff;
					}
				});
			});

		$scope.STATES = {
			INPUT: "INPUT",
			ERROR: "ERROR"
		};

		$scope.state = $scope.STATES.INPUT;
	}
}

function card2cardInputDirective() {
	return {
		restrict: 'A',
		link: postLink,
		controller: ['$scope', Ctrl],
		controllerAs: 'vmInput',
		template: require('./templates/input.html')
	};

	function postLink(scope, element, attrs) {
		scope.$watch('c2cForm', function() {
			window.error = scope.c2cForm.$error;
		});
	}
	
	function Ctrl($scope) {
		var config = $scope.config;

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
		
		this.submit = function() {
			$scope.state = $scope.STATES.ERROR;
			console.log('SUBMIT');
		};
	}
}
function card2cardErrorDirective() {
	return {
		restrict: 'A',
		link: postLink,
		template: require('./templates/error.html')
	};

	function postLink(scope, element, attrs) {
	}
}