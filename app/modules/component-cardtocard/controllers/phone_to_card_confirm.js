Ctrl.$inject = ['$scope', '$http', '$timeout','CardToCard'];
function Ctrl($scope, $http, $timeout, CardToCard) {

    function getStatePhone(operationNumber) {
        $scope.loader = true;
        $http({
            method: 'POST',
            url: CardToCard.urls.getStatePhone,
            data: {
                operationNumber: operationNumber,
                receive: true
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




    $scope.submit = function () {
        $scope.loader = true;

        $http({
            method: 'POST',
            url: CardToCard.urls.getPayment,
            data: {
                operationNumber: $scope.transaction.operationNumber,
                // phone: $scope.transaction.socialNumber,
                cardTo: $scope.transaction.cardTo,
                otp: $scope.otpcode
            }
        }).then(function successCallback(response) {
            var data = response.data,
                transaction = {};

            if (data.message == 'Accepted') {
                transaction = {
                    amount: data.amount / 100,

                };
                getStatePhone($scope.transaction.operationNumber);
            } else {
                transaction = {
                    state: data.message
                };
                $scope.goState($scope.STATES.ERROR);
            }
            $scope.saveTransaction(transaction);
        }, function errorCallback(response) {
            $scope.goState($scope.STATES.ERROR);
        }).finally(function () {
            // $scope.loader = false;
        });
    }
}

module.exports = Ctrl;