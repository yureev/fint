Ctrl.$inject = ['$scope', '$http', 'CardToCard'];
function Ctrl($scope, $http, CardToCard) {

    $scope.submit = function () {
        $scope.loader = true;
        $http({
            method: 'POST',
            url: CardToCard.urls.getPayment,
            data: {
                operationNumber: $scope.operationNumber,
                // phone: $scope.socialNumber || "+380502956087",
                cardTo: $scope.cardTo
            }
        }).then(function successCallback(response) {
            var data = response.data;
            if (data.message == 'OTP Code was send') {
                transaction = {
                    operationNumber: $scope.operationNumber,
                    // socialNumber: $scope.socialNumber || "+380502956087",
                    cardTo: $scope.cardTo
                };
                $scope.goState($scope.STATES.PHONE_TO_CARD_CONFIRM);
            } else {
                transaction.state = data.message;

                $scope.goState($scope.STATES.ERROR);
            }

            $scope.saveTransaction(transaction);
        }, function errorCallback(response) {
            $scope.goState($scope.STATES.ERROR);
        }).finally(function () {
            $scope.loader = false;
        });
    }
}

module.exports = Ctrl;