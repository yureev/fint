Ctrl.$inject = ['$scope', '$http', '$timeout', 'CardToCard'];
function Ctrl($scope, $http, $timeout, CardToCard) {


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
				transaction.md = data.md;
				transaction.code = data.operationNumber;

				$scope.goState($scope.STATES.SUCCESS);
			}  else  if (data.state.code == 2 || data.state.code == 8) {

				var d = new Date();
				d.setSeconds(d.getSeconds());
				if (d <= $scope.beginTime){
					$timeout(function(){getStatePhone(data.operationNumber);},3000)
				} else  $scope.goState($scope.STATES.ERROR);

				// $timeout(function(){getState(data.operationNumber);},3000)

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



	function getState(operationNumber){

		$http({
			method: 'POST',
			url: CardToCard.urls.getState,
			data: {
				operationNumber : $scope.transaction.operationNumber
			}
		}).then(function successCallback(response) {
			var data = response.data,
				transaction = {};

			if (data.state.code == 0) {
				transaction.md = data.md;
				transaction.code = data.operationNumber;

				$scope.goState($scope.STATES.SUCCESS);
			}  else  if (data.state.code == 2 || data.state.code == 8) {

				var d = new Date();
				d.setSeconds(d.getSeconds());

				if (d <= $scope.beginTime){
					$timeout(function(){getState(data.operationNumber);},3000)

				} else  $scope.goState($scope.STATES.ERROR);
				
				// $timeout(function(){getState(data.operationNumber);},3000)

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

	$scope.beginTime = '';
	window.uploadDone = function() {
		var iframe = document.getElementById("ifr3Dcard").contentWindow;

		iframe.postMessage(JSON.stringify({secur3d: $scope.transaction.secur3d}), '*');
		var d = new Date();
		d.setSeconds(d.getSeconds() + 180);
		$scope.beginTime = d;

		if ($scope.transaction.cardToPhone) {
			getStatePhone($scope.transaction.operationNumber)
		} else {
			getState($scope.transaction.operationNumber)
		}
	};
}

module.exports = Ctrl;