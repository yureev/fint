require('./index.sass');

angular.module('card2card', [
	require('component-payments'),
	require('_modules/components/currency')
])
	.directive('card2card', card2cardDirective)
	.directive('card2cardInput', card2cardInputDirective)
	.directive('card2cardLookup', card2cardLookupDirective)
	.directive('card2cardError', card2cardErrorDirective)
	.directive('card2cardSuccess', card2cardSuccessDirective)
	.directive('onlyDigits', onlyDigitsDirective)
	.controller('Card2cardCtrl', ['$scope', '$http', Card2cardCtrl]);

function Card2cardCtrl($scope, $http) {
	var config = $scope.config = {
		tariff: null,
		tariffType: 'other'
	};

	$scope.STATES = {
		INPUT: "INPUT",
		ERROR: "ERROR",
		LOOKUP: "LOOKUP",
		SUCCESS: "SUCCESS"
	};

	this.goState = function (state) {
		$scope.state = state;
	};

	this.saveTransaction = function (transaction) {
		$scope.transaction = transaction;
	};

	this.getTariffs = function () {
		$http.jsonp('/sendua-external/Info/GetTariffs?tarifftype=web&callback=JSON_CALLBACK')
			.then(function (response) {
				var data = response.data;

				angular.forEach(data, function (tariff) {
					if (tariff.card_type == config.tariffType) {
						config.tariff = tariff;
					}
				});
			});
	};
}

module.exports = 'card2card';

function card2cardDirective() {
	return {
		restrict: 'A',
		link: postLink,
		controller: 'Card2cardCtrl',
		controllerAs: 'vm',
		template: require('./templates/main.html')
	};

	function postLink(scope, element, attrs, Card2cardCtrl) {
		element.addClass('card2card');

		Card2cardCtrl.goState(scope.STATES.INPUT);
		Card2cardCtrl.getTariffs();
	}
}

function card2cardInputDirective() {
	return {
		restrict: 'A',
		link: postLink,
		require: ['^card2card', 'card2cardInput'],
		controller: ['$scope', '$http', '$controller', Ctrl],
		controllerAs: 'vmInput',
		template: require('./templates/input.html')
	};

	function postLink(scope, element, attrs, ctrls) {
		var Card2cardCtrl = ctrls[0],
			Card2cardInputCtrl = ctrls[1];

		scope.submit = function() {
			Card2cardInputCtrl.submit();
		};
	}
	
	function Ctrl($scope, $http, $controller) {
		var config = $scope.config,
			Card2cardCtrl = $controller('Card2cardCtrl', {$scope: $scope.$parent});

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
			$http({
				method: 'POST',
				url: '/sendua-external/Card2Card/CreateCard2CardOperation',
				data: {
					ammount: {
						summa: Math.round($scope.amount * 100),
						commission: Math.round($scope.commiss * 100),
						type: 'web'    // parameter from global settings
					},
					cardFrom: {
						cardNumber: $scope.number,
						dateValid: $scope.viewExpire.month + '/' + $scope.viewExpire.year,
						cvv: $scope.cvc
					},
					cardTo: $scope.numberTarget,
					inputType: null,
					ipaddress: null,
					maskfrom: null,
					maskto: null,
					mobile: null,
					socialNumber: '+380' + $scope.phone,
					version: "1.0"

				}
			}).then(function successCallback(response) {
				var data = response.data;

				Card2cardCtrl.saveTransaction({
					number: $scope.number.substring(-4, 4),
					numberTarget: $scope.numberTarget.substring(-4, 4),
					amount: $scope.amount,
					commiss: $scope.comiss,
					
				});

				$scope.operationNumber = data.idClient || data.operationNumber;

				if (data.state.code == 0 || data.state.code == 59) {
					if(!!data.secur3d && data.secur3d.paReq == 'lookup') {
						$scope.md = data.secur3d.md;
						$scope.cvv = '';
						Card2cardCtrl.goState($scope.STATES.LOOKUP);
					} else if (!!data.secur3d) {
						//Send.secur3d = {
						//	acsUrl: data.secur3d.acsUrl,
						//	paReq: data.secur3d.paReq,
						//	termUrl: data.secur3d.termUrl,
						//	md: data.secur3d.md
						//};

						// Card2cardCtrl.goState($scope.STATES.3DSEC);
					} else {
						alert('Сервис временно не работает');
					}
				} else {
					// ERROR
					var code = (data.state && data.state.code) || data.mErrCode;

					$scope.mPayStatus = $scope.response.errors[$scope.lang][code] ? $scope.response.errors[$scope.lang][code] + '<br/>' + (data.mPayStatus || data.state.message) : (data.mPayStatus || data.state.message);

					Card2cardCtrl.goState($scope.STATES.ERROR);
				}
			}, function errorCallback(response) {
				Card2cardCtrl.goState($scope.STATES.ERROR);
			});
		};
	}
}

function card2cardLookupDirective() {
	return {
		restrict: 'A',
		link: postLink,
		template: require('./templates/lookup.html'),
		require: ['^card2card', 'card2cardLookup'],
		controller: ['$scope', '$http', '$controller', Ctrl],
		controllerAs: 'vmLookup'
	};

	function postLink(scope, element, attrs, ctrls) {
		var Card2cardLookupCtrl = ctrls[1];

		scope.submit = function () {
			Card2cardLookupCtrl.submit();
		}
	}

	function Ctrl($scope, $http, $controller) {
		var config = $scope.config,
			Card2cardCtrl = $controller('Card2cardCtrl', {$scope: $scope.$parent});

		this.submit = function () {
			console.log({
				md: $scope.md,
				paRes: $scope.lookupCode,
				cvv: '000'
			});
			$http({
				method: 'POST',
				url: '/sendua-external/ConfirmLookUp/finishlookup',
				data: {
					md: $scope.md,
					paRes: $scope.lookupCode,
					cvv: '000'
				}
			}).then(function successCallback(response) {
				var data = response.data;
				$scope.operationNumber = data.idClient || data.operationNumber || data.mPayNumber;

				if(data.state.code == 0) {
					Card2cardCtrl.goState($scope.STATES.SUCCESS);
				} else {
					$scope.mPayStatus = $scope.response.errors[$scope.lang][code] ? $scope.response.errors[$scope.lang][code] + '<br/>' + (data.mPayStatus || data.state.message) : (data.mPayStatus || data.state.message);
					Card2cardCtrl.goState($scope.STATES.ERROR);
				}
				
			}, function errorCallback(response) {
				Card2cardCtrl.goState($scope.STATES.ERROR);
			});
		}
	}
}

function card2cardSuccessDirective() {
	return {
		restrict: 'A',
		link: postLink,
		template: require('./templates/success.html'),
		require: ['^card2card', 'card2cardSuccess'],
		controller: ['$scope', '$http', '$controller', Ctrl]
	};

	function postLink(scope, element, attrs, ctrls) {
	}

	function Ctrl($scope, $http, $controller) {
		$http.get('/sendua-external/Info/GetDateTime')
			.then(function (response) {
				var data = response.data;

				$scope.currentDate = data.datetime || new Date();
			}, function() {
				$scope.currentDate = new Date();
			});
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

function onlyDigitsDirective(CtUtils){
	return {
		restrict: 'A',
		link: postLink
	};

	function postLink(scope, element, attr, ctrl) {
		element.on('keypress', onKeyPress);

		function onKeyPress(e) {
			var char = CtUtils.getChar(e);

			if (!char.match(/./)) {
				return;
			}

			if (!char.match(/\d/)) {
				e.preventDefault();
			}
		}
	}
}