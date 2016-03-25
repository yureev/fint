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
	.directive('amount', amountDirective)
	.controller('Card2cardCtrl', ['$scope', '$http', Card2cardCtrl]);

function Card2cardCtrl($scope, $http) {
	$scope.config = {
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
		angular.extend($scope.transaction || {}, transaction);
	};

	this.getTariffs = function () {
		$http.jsonp('https://stage.send.ua/sendua-external/Info/GetTariffs?tarifftype=web&callback=JSON_CALLBACK')
			.then(function (response) {
				var data = response.data;

				angular.forEach(data, function (tariff) {
					if (tariff.card_type == $scope.config.tariffType) {
						$scope.config.tariff = tariff;
					}
				});
			});
	};
}

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
		var Card2cardCtrl = $controller('Card2cardCtrl', {$scope: $scope.$parent});

		this.calculate = function () {
			$scope.commiss = Math.round($scope.amount * $scope.config.tariff.comm_percent + $scope.config.tariff.comm_fixed);

			if ($scope.commiss < $scope.config.tariff.total_min) {
				$scope.commiss = $scope.config.tariff.total_min / 100;
			} else if ($scope.commiss > $scope.config.tariff.total_max) {
				$scope.commiss = $scope.config.tariff.total_max / 100;
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
				var data = response.data,
					transaction = {
						number: $scope.number.substr(-4),
						numberTarget: $scope.numberTarget.substr(-4),
						amount: $scope.amount,
						commiss: $scope.commiss,
						total: $scope.total
					};

				$scope.operationNumber = data.idClient || data.operationNumber;

				if (data.state.code == 0 || data.state.code == 59) {
					if(!!data.secur3d && data.secur3d.paReq == 'lookup') {
						transaction.md = data.secur3d.md;
						transaction.cvv =  '';

						Card2cardCtrl.goState($scope.STATES.LOOKUP);
					} else if (!!data.secur3d) {


						//transaction.secur3d = {
						//	acsUrl: data.secur3d.acsUrl,
						//	paReq: data.secur3d.paReq,
						//	termUrl: data.secur3d.termUrl,
						//	md: data.secur3d.md
						//};

						// Card2cardCtrl.goState($scope.STATES.3DSEC);
					} else {
						//alert('Сервис временно не работает');
					}


				} else {
					// ERROR
					var code = (data.state && data.state.code) || data.mErrCode;

					transaction.mPayStatus = data.mPayStatus || data.state.message;

					Card2cardCtrl.goState($scope.STATES.ERROR);
				}

				Card2cardCtrl.saveTransaction(transaction);
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
		};
		scope.goState = function(state) {
			Card2cardCtrl.goState(state);
		}
	}

	function Ctrl($scope, $http, $controller) {
		var Card2cardCtrl = $controller('Card2cardCtrl', {$scope: $scope.$parent});

		this.submit = function () {

			$http({
				method: 'POST',
				url: '/sendua-external/ConfirmLookUp/finishlookup',
				data: {
					md: $scope.md,
					paRes: $scope.lookupCode,
					cvv: '000'
				}
			}).then(function successCallback(response) {
				var data = response.data,
					transaction = {};
				
				transaction.operationNumber = data.idClient || data.operationNumber || data.mPayNumber;

				if(data.state.code == 0) {
					Card2cardCtrl.goState($scope.STATES.SUCCESS);
				} else {
					transaction.mPayStatus = $scope.response.errors[$scope.lang][code] ? $scope.response.errors[$scope.lang][code] + '<br/>' + (data.mPayStatus || data.state.message) : (data.mPayStatus || data.state.message);
					Card2cardCtrl.goState($scope.STATES.ERROR);
				}

				Card2cardCtrl.saveTransaction(transaction);
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
		var Card2cardCtrl = ctrls[0];
		
		scope.goState = function(state) {
			Card2cardCtrl.goState(state);
		} 
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
function amountDirective(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: postLink
	};

	function postLink(scope, element, attr, ModelCtrl) {
		ModelCtrl.$formatters.push(check);
		ModelCtrl.$parsers.push(check);

		function check(value) {
			if (!value) {
				value = 0;
			}

			return value;
		}
	}
}

module.exports = 'card2card';