Ctrl.$inject = ['$scope', '$http', 'CardToCard'];
function Ctrl($scope, $http, CardToCard) {
    var self = this;

    $scope.submit = function () {
        self.submit();
    };

    this.submit = function () {
        $scope.input_loader = true;

        $http({
            method: 'POST',
            url: CardToCard.urls.generateLink,
            data: {
                cardTo: $scope.number,
                amount: $scope.amount * 100
            }
        })
            .then(function successCallback(response) {
                var base64Url = require('base64-url');

                var data = response.data;

                var transaction = {
                    link: CardToCard.linkPrefix + base64Url.escape(data.link) + '?phone=' + $scope.phone + '&amount=' + $scope.amount,
                    // md: data.md
                };

                $scope.saveTransaction(transaction);

                $scope.goState($scope.STATES.SEND);
            }, function errorCallback(response) {
                $scope.goState($scope.STATES.ERROR);
            })
            .finally(function () {
                $scope.input_loader = false;
            });
    };
}

module.exports = Ctrl;