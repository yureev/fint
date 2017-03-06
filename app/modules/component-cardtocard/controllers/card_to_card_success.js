Ctrl.$inject = ['$scope', '$element', '$http', '$compile', '$timeout', 'CardToCard'];
function Ctrl($scope, $element, $http, $compile, $timeout, CardToCard) {
    $scope.loader = true;

    $http.get(CardToCard.urls.getDateTime)
        .then(function (response) {
            var data = response.data;

            $scope.currentDate = data.datetime || new Date();
        }, function () {
            $scope.currentDate = new Date();
        })
        .finally(function() {
            $scope.loader = false;
        });

    $scope.printDiv = function () {
        var popupWin = window.open('', '_blank', 'width=800,height=600');
        var html = angular.element(CardToCard.recieptTemplate);

        var linkFn = $compile(html);
        var content = linkFn($scope);

        $timeout(function() {
            popupWin.document.open();
            popupWin.document.write('<body onload="window.print()">' + content.html() + '</body>');
            popupWin.document.close();
        });
    };

    $scope.toEmail = function() {
        $scope.loader = true;

        $http.post(CardToCard.urls.getReceipt, {
            operationNumber: $scope.transaction.operationNumber,
            email: $scope.email
        })
            .then(function (response) {
                var data = response.data;

                if (data.code == 0) {
                    $scope.$emit('Card2CardReceiptSendSuccess', {
                        email: $scope.email
                    });
                } else {
                    $scope.$emit('Card2CardReceiptSendError');
                }
            }, function () {
                $scope.$emit('Card2CardReceiptSendError');
            })
            .finally(function() {
                $scope.loader = false;
            });
    }
}

module.exports = Ctrl;