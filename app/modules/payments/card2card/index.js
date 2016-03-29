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
	.directive('card2card3dsec', ['$timeout', card2card3dsecDirective])
	.directive('onlyDigits', ['CtUtils', onlyDigitsDirective])
	.directive('amount', amountDirective)
	.controller('Card2cardCtrl', ['$scope', '$http', Card2cardCtrl]);

function Card2cardCtrl($scope, $http) {
	$scope.config = {
		tariff: null,
		tariffType: 'other'
	};

	$scope.transaction = {};

	$scope.STATES = {
		INPUT: "INPUT",
		ERROR: "ERROR",
		LOOKUP: "LOOKUP",
		SUCCESS: "SUCCESS",
		THREEDSEC: "THREEDSEC"
	};

	$scope.goState = function (state) {
		$scope.state = state;
	};

	$scope.saveTransaction = function (transaction) {
		angular.extend($scope.transaction, transaction);

		console.log('saveTransaction');
		console.log(transaction);
		console.log($scope);
	};

	$scope.getTariffs = function () {
		$scope.tariffs_loader = true;

		// $http.get(require('_data/tariffs.json'))
		$http.get('/sendua-external/Info/GetTariffs?tarifftype=web')
			.then(function (response) {
				var data = response.data;
				angular.forEach(data, function (tariff) {
					if (tariff.card_type == $scope.config.tariffType) {
						$scope.config.tariff = tariff;
					}
				});

			})
			.finally(function () {
				$scope.tariffs_loader = false;
			});

		return;
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

	function postLink(scope, element, attrs) {
		element.addClass('card2card');

		scope.goState(scope.STATES.INPUT);
		scope.getTariffs();
	}
}

function card2cardInputDirective() {
	return {
		restrict: 'A',
		link: postLink,
		require: 'card2cardInput',
		controller: ['$scope', '$http', Ctrl],
		controllerAs: 'vmInput',
		template: require('./templates/input.html')
	};

	function postLink(scope, element, attrs, Card2cardInputCtrl) {
		scope.submit = function() {
			Card2cardInputCtrl.submit()
		};

		scope.cvcType = 'password';
		scope.toggleCvc = function() {
			if (scope.cvcType == 'password') {
				scope.cvcType = 'text';
			} else {
				scope.cvcType = 'password';
			}
		}
	}
	
	function Ctrl($scope, $http) {
		this.calculate = function () {
			$scope.commiss = Math.round($scope.amount * $scope.config.tariff.comm_percent + $scope.config.tariff.comm_fixed);

			if ($scope.commiss < $scope.config.tariff.total_min) {
				$scope.commiss = $scope.config.tariff.total_min;
			} else if ($scope.commiss > $scope.config.tariff.total_max) {
				$scope.commiss = $scope.config.tariff.total_max;
			}

			$scope.total = ($scope.amount*100 + $scope.commiss)/100;
			$scope.commiss/=100;
		};

		this.submit = function() {
			$scope.input_loader = true;

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
						total: $scope.total,
						operationNumber: data.idClient || data.operationNumber
					};

				if (data.state.code == 0 || data.state.code == 59) {
					if(!!data.secur3d && data.secur3d.paReq == 'lookup') {
						console.log('data');
						console.log(data);


						transaction.md = data.secur3d.md;
						transaction.cvv =  '';

						$scope.goState($scope.STATES.LOOKUP);
					} else if (!!data.secur3d) {


						transaction.secur3d = {
							acsUrl: data.secur3d.acsUrl,
							paReq: data.secur3d.paReq,
							termUrl: data.secur3d.termUrl,
							md: data.secur3d.md
						};

						 $scope.goState($scope.STATES.THREEDSEC);
					} else {
						//alert('Сервис временно не работает');
					}


				} else {
					// ERROR
					var code = (data.state && data.state.code) || data.mErrCode;

					transaction.mPayStatus = data.mPayStatus || data.state.message;

					$scope.goState($scope.STATES.ERROR);
				}

				$scope.saveTransaction(transaction);
			}, function errorCallback(response) {
				$scope.goState($scope.STATES.ERROR);
				})
				.finally(function () {
					$scope.input_loader = false;
			});
		};
	}
}

function card2cardLookupDirective() {
	return {
		restrict: 'A',
		link: postLink,
		template: require('./templates/lookup.html'),
		require: 'card2cardLookup',
		controller: ['$scope', '$http', Ctrl],
		controllerAs: 'vmLookup'
	};

	function postLink(scope, element, attrs, Card2cardLookupCtrl) {
		scope.submit = function () {

			Card2cardLookupCtrl.submit()

		};
	}

	function Ctrl($scope, $http) {
		this.submit = function () {
			console.log('Submit');
			console.log($scope);

			$scope.lookup_loader = true;

			$http({
				method: 'POST',
				url: '/sendua-external/ConfirmLookUp/finishlookup',
				data: {
					md: $scope.transaction.md,
					paRes: $scope.lookupCode,
					cvv: '000'
				}
			}).then(function successCallback(response) {

				var data = response.data,
					transaction = {};

				transaction.operationNumber = data.idClient || data.operationNumber || data.mPayNumber;

				if(data.state.code == 0) {
					$scope.goState($scope.STATES.SUCCESS);
				} else {
					transaction.mPayStatus = $scope.response.errors[$scope.lang][code] ? $scope.response.errors[$scope.lang][code] + '<br/>' + (data.mPayStatus || data.state.message) : (data.mPayStatus || data.state.message);
					$scope.goState($scope.STATES.ERROR);
				}

				$scope.saveTransaction(transaction);
			}, function errorCallback(response) {
				$scope.goState($scope.STATES.ERROR);
			}).finally(function() {
				$scope.lookup_loader = false;
				
			});
		}
	}
}

function card2cardSuccessDirective() {
	return {
		restrict: 'A',
		link: postLink,
		template: require('./templates/success.html'),
		controller: ['$scope', '$http', Ctrl]
	};

	function postLink(scope, element, attrs) {
	}

	function Ctrl($scope, $http) {
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

function card2card3dsecDirective($timeout) {
	return {
		restrict: 'A',
		link: postLink,
		template: require('./templates/3dsec.html'),
		controller: ['$scope', '$http', Ctrl]
	};

	function postLink(scope, element, attrs) {
	}
	function Ctrl($scope, $http) {
		angular.element(window).on('message', function (event) {
            var d = event.data || event.originalEvent.data || window.event.data;
            d = JSON.parse(d);

			console.log('MESSAGE 2', d);

            if (d.secure) {
                //$rootScope.send.changeStage(7);
				$http({
					method: 'POST',
					url: '/sendua-external/Info/GetPayStatus',
					data: {
						mErrCode: 0,
						mPayNumber: $scope.transaction.operationNumber,
						mPayStatus: $scope.transaction.mPayStatus || ''
					}
				}).then(function successCallback(response) {
					var data = response.data,
						transaction = {};

					console.log('response', response);

					transaction.operationNumber = data.idClient || data.operationNumber || data.mPayNumber;

					if (data.mErrCode == 0) {
						$scope.goState($scope.STATES.SUCCESS);
					} else {
						transaction.mPayStatus = data.mPayStatus || data.state.message;
						$scope.goState($scope.STATES.ERROR);
					}
					
				}, function errorCallback(response) {
					$scope.goState($scope.STATES.ERROR);
				})
            } else if (d.lang) {
                //$rootScope.lang = d.lang;
                //$rootScope.word = $rootScope.vocabulary[$rootScope.lang];
                //localStorage.setItem('lang', $rootScope.lang);
            } else {
                //$rootScope.send.changeStage(1, true);
            }


            //$scope.$apply();
        });

		window.uploadDone = function() {
			console.log('uploadDone', $scope.transaction.secur3d);

			var iframe = document.getElementById("ifr3Dcard").contentWindow;
			iframe.postMessage(JSON.stringify({secur3d: $scope.transaction.secur3d}), '*');
		};
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