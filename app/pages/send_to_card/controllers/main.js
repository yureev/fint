Ctrl.$inject = ['$rootScope', '$scope', '$stateParams', '$timeout'];
function Ctrl($rootScope, $scope, $stateParams, $timeout) {
    if ($stateParams.payLink) {
        $timeout(function() {
            $scope.$broadcast('GetLinkParams', {
                link: $stateParams.payLink
            });
        });
    }

    $scope.agreed = true;

    $scope.target = {};

    $scope.$on('GetLinkParamsSuccess', onGetLinkParamsSuccess);
    
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
        $scope.amount = data.amount / 100;
        $scope.target.card = data.mask;

        $scope.$broadcast('Card2CardCalculate');
    }
}

module.exports = Ctrl;