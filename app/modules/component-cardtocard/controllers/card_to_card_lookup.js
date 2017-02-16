Ctrl.$inject = ['$scope', '$http', '$timeout', 'CardToCard'];
function Ctrl($scope, $http, $timeout, CardToCard) {
	var self = this;



	$scope.submit = function () {
		self.submit();
	};

	function getStatePhone(operationNumber) {
		$scope.lookup_loader = true;
		$http({
			method: 'POST',
			url: CardToCard.urls.getStatePhone,
			data: {
				operationNumber: operationNumber,
				receive: false
			}
		}).then(function successCallback(response) {
			var data = response.data,
				transaction = {};


			if (data.state.code == 0) {
				// transaction.md = data.md;
				transaction.code = data.operationNumber;

				$scope.goState($scope.STATES.SUCCESS);
			}  else  if (data.state.code == 2) {
				$timeout(function(){getStatePhone(data.operationNumber);},3000)

			} else  {
				transaction.mPayStatus = data.state.code || data.state.message;
				transaction.operationNumber = data.operationNumber;
				$scope.goState($scope.STATES.ERROR);
			}
			$scope.saveTransaction(transaction);
		}, function errorCallback(response) {
			$scope.goState($scope.STATES.ERROR);

		}).finally(function () {

		});
	};


	function getState(operationNumber) {
		$scope.lookup_loader = true;
			$http({
				method: 'POST',
				url: CardToCard.urls.getState,
				data: {
					operationNumber: operationNumber
				}
			}).then(function successCallback(response) {
				var data = response.data,
					transaction = {};


				if (data.state.code == 0) {
					transaction.md = data.md;
					transaction.code = data.operationNumber;

					$scope.goState($scope.STATES.SUCCESS);
				}  else  if (data.state.code == 2) {
					$timeout(function(){getState(data.operationNumber);},3000)

				} else  {
					transaction.mPayStatus = data.state.code || data.state.message;
					transaction.operationNumber = data.operationNumber;
					$scope.goState($scope.STATES.ERROR);
				}
				$scope.saveTransaction(transaction);
			}, function errorCallback(response) {
				$scope.goState($scope.STATES.ERROR);

			}).finally(function () {

			});
	};

	function lookupContinue(md, code) {
		$scope.lookup_loader = true;
		$http({
			method: 'POST',
			url: CardToCard.urls.lookupContinue,
			data: {
				md: md,
				code: code
			}
		}).then(function successCallback(response) {
			var data = response.data;
			if (data.message == 'Accepted') {
				if ($scope.transaction.cardToPhone){
					getStatePhone(data.operationNumber);
				} else getState(data.operationNumber);
			} else {
				transaction.mPayStatus = data.message;
				// transaction.operationNumber = data.operationNumber; //какой ответ с сервака????
				$scope.goState($scope.STATES.ERROR);
			}
			$scope.saveTransaction(transaction);
		}, function errorCallback(response) {
			$scope.goState($scope.STATES.ERROR);
		}).finally(function () {
			// $scope.lookup_loader = false;
		});
	};

	this.submit = function () {
		$scope.lookup_loader = true;

		if ($scope.transaction.crossboardAllowed || !$scope.transaction.link) {
			lookupContinue($scope.transaction.md, $scope.lookupCode)
		} else if ($scope.transaction.crossboardAllowed || $scope.transaction.link) {
            lookupContinue($scope.transaction.md, $scope.lookupCode)
        }
        else {
			$scope.goState($scope.STATES.ERROR);
		}

	}
}

module.exports = Ctrl;