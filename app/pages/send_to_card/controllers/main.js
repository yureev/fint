Ctrl.$inject = ['$scope', '$stateParams', '$timeout', '$translate', 'Notification'];
function Ctrl($scope, $stateParams, $timeout, $translate, Notification) {
    if ($stateParams.payLink) {
        $timeout(function() {
            $scope.$broadcast('GetLinkParams', {
                link: $stateParams.payLink,
                phone: $stateParams.phone,
                amount: $stateParams.amount
            });
        });
    }

    $scope.agreed = true;

    $scope.target = {};

    $scope.$on('GetLinkParamsSuccess', onGetLinkParamsSuccess);
    $scope.$on('Card2CardReceiptSendSuccess', onCard2CardReceiptSendSuccess);
    $scope.$on('Card2CardReceiptSendError', onCard2CardReceiptSendError);

    $translate('HEADLINE').then(function (headline) {
        $scope.headline = headline;
    });

    $scope.numberTargetMask = '9999 9999 9999 9999';
    $scope.numberTargetIsDisabled = false;
    
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

    function onGetLinkParamsSuccess(event, data) {
        $scope.numberTargetMask = '';
        $scope.numberTargetIsDisabled = true;
        if($stateParams.amount) {
            $scope.amount = $stateParams.amount;
        } else {
            $scope.amount = data.amount / 100;
        }

        $scope.target.card = data.card;
        //console.log($scope.target.card);
        $scope.phone = $stateParams.phone;

        $scope.$broadcast('Card2CardCalculate');
    }

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