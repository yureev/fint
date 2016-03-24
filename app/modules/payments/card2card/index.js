require('./index.sass');

angular.module('card2card', [
	require('component-payments'),
	require('_modules/components/currency')
])
	.directive('card2card', card2cardDirective)
	.directive('card2cardInput', card2cardInputDirective)
	.directive('card2cardLookup', card2cardLookupDirective)
	.directive('card2cardError', card2cardErrorDirective)
	.directive('onlyDigits', onlyDigitsDirective);

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
		var self = this,
			config = $scope.config = {
				tariff: null,
				tariffType: 'other'
			},
			init = function() {
				$http.jsonp('https://send.ua/sendua-external/Info/GetTariffs?tarifftype=web&callback=JSON_CALLBACK')
					.then(function(response) {
						var data = response.data;

						angular.forEach(data, function (tariff) {
							if (tariff.card_type == config.tariffType) {
								config.tariff = tariff;
							}
						});
					});

				self.goState($scope.STATES.INPUT);

			};

		$scope.STATES = {
			INPUT: "INPUT",
			ERROR: "ERROR",
			LOOKUP: "LOOKUP"
		};

		this.goState = function(state) {
			$scope.state = state;
		};

		init();
	}
}

function card2cardInputDirective() {
	return {
		restrict: 'A',
		link: postLink,
		require: ['^card2card', 'card2cardInput'],
		controller: ['$scope', '$http', Ctrl],
		controllerAs: 'vmInput',
		template: require('./templates/input.html')
	};

	function postLink(scope, element, attrs, ctrls) {
		var Card2cardCtrl = ctrls[0],
			Card2cardInputCtrl = ctrls[1];

		scope.submit = function() {
			Card2cardInputCtrl.submit();
		};

		scope.$watch('c2cForm', function() {
			window.error = scope.c2cForm.$error;
		});
	}
	
	function Ctrl($scope, $http) {
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

		this.paramsForCreateOperattion = function(){
			var data = {};
			
			data.ammount = {
				summa: Math.round($scope.amount * 100),
				commission: Math.round($scope.commiss * 100),
				type: 'web'    // parameter from global settings
			};
			data.cardFrom = {
				cardNumber: $scope.number,
				dateValid: $scope.viewExpire.month + '/' + $scope.viewExpire.year,
				cvv: $scope.cvc
			};
			data.cardTo = $scope.numberTarget;
			data.inputType = null;
			data.ipaddress = null;
			data.maskfrom = null;
			data.maskto = null;
			data.mobile = null;
			data.socialNumber = '+380' + $scope.phone;
			data.version = "1.0";
			
			return data;
		};
		
		this.submit = function() {
			$http({
				method: 'POST',
				url: 'https://send.ua/sendua-external/Card2Card/CreateCard2CardOperation',
				data: this.paramsForCreateOperattion()
			}).then(function successCallback(response) {
				console.log('response: ', response);
				var data = response.data;
				$scope.operationNumber = data.idClient || data.operationNumber;
				if (data.state.code == 0 || data.state.code == 59) {

					if(!!data.secur3d && data.secur3d.paReq == 'lookup') {
						$scope.md = data.secur3d.md;
						$scope.cvv = '';
						Card2cardCtrl.goState(scope.STATES.LOOKUP);
					} else if (!!data.secur3d) {
						Send.secur3d = {
							acsUrl: data.secur3d.acsUrl,
							paReq: data.secur3d.paReq,
							termUrl: data.secur3d.termUrl,
							md: data.secur3d.md
						};

						// Card2cardCtrl.goState(scope.STATES.3DSEC);
					} else {
						alert('Сервис временно не работает');
					}
				} else {
					// ERROR
					var code = (data.state && data.state.code) || data.mErrCode;
					$scope.mPayStatus = $scope.response.errors[$scope.lang][code] ? $scope.response.errors[$scope.lang][code] + '<br/>' + (data.mPayStatus || data.state.message) : (data.mPayStatus || data.state.message);
					Card2cardCtrl.goState(scope.STATES.ERROR);
				}
			}, function errorCallback(response) {
				console.log('error: ', response);
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
		controller: ['$scope', '$http', Ctrl],
		controllerAs: 'vmLookup'
	};

	function postLink(scope, element, attrs) {

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