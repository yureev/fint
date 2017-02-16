Ctrl.$inject = ['$scope', '$http', 'CardToCard'];
function Ctrl($scope, $http, CardToCard) {
    var self = this;

    $scope.submit = function () {
        self.submit();
    };

    this.submit = function () {
        $scope.send_loader = true;

        $http({
            method: 'POST',
            url: CardToCard.urls.sendLinkToMail + '?email=' + $scope.email,
            data: {
                // md: $scope.transaction.md,
                link: $scope.transaction.link
            }
        }).then(function successCallback(response) {
            var data = response.data;

            if (data.code == 0) {
                $scope.goState($scope.STATES.SUCCESS);
            } else {
                $scope.goState($scope.STATES.ERROR);
            }
        }, function errorCallback(response) {
            $scope.goState($scope.STATES.ERROR);
        }).finally(function () {
            $scope.send_loader = false;
        });
    }
}

module.exports = Ctrl;