Ctrl.$inject = ['$scope', '$translate', 'Notification'];
function Ctrl($scope, $translate, Notification) {
    window.Notification = Notification;

    $scope.agreed = true;

    $scope.$on('Card2CardReceiptSendSuccess', onCard2CardReceiptSendSuccess);
    $scope.$on('Card2CardReceiptSendError', onCard2CardReceiptSendError);

    $scope.checkNumber = function (ctrl) {
        if (ctrl.$valid && ctrl.$modelValue && ctrl.$modelValue.length == 16) {
            return true;
        }
    };
    $scope.checkMonth = function (ctrl) {
        if (ctrl.$valid && ctrl.$modelValue && ctrl.$modelValue.length == 2) {
            return true;
        }
    };
    $scope.checkYear = function (ctrl) {
        if (ctrl.$valid && ctrl.$modelValue && ctrl.$modelValue.length == 2) {
            return true;
        }
    };
    $scope.checkCvc = function (ctrl) {
        if (ctrl.$valid && ctrl.$modelValue && ctrl.$modelValue.length == 3) {
            return true;
        }
    };
    $scope.checkPhone = function (ctrl) {
        if (ctrl.$valid && ctrl.$modelValue && ctrl.$modelValue.length == 9) {
            return true;
        }
    };
    $scope.checkTargetNumber = function (ctrl) {
        if (ctrl.$valid && ctrl.$modelValue && ctrl.$modelValue.length == 16) {
            return true;
        }
    };

    function onCard2CardReceiptSendSuccess(event, data) {
        var email = data.email;

        $translate('CARD2CARD.SUCCESS.EMAIL_SENT_SUCCESS', {
            email: email
        }).then(function(value) {
            Notification.success(value);
        });
    }

    function onCard2CardReceiptSendError() {
        $translate('CARD2CARD.SUCCESS.EMAIL_SENT_ERROR').then(function(value) {
            Notification.error(value);
        });
    }

}

module.exports = Ctrl;