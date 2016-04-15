Ctrl.$inject = ['$scope', '$stateParams'];
function Ctrl($scope, $stateParams) {
    if ($stateParams.payLink) {
        $scope.$broadcast('GetLinkParams', {
            link: $stateParams.payLink
        });
    }

    $scope.$on('GetLinkParamsSuccess', onGetLinkParams);
    
    
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

    function onGetLinkParams(event, data) {
        $scope.amount = data.amount;
        $scope.numberTarget = data.mask;
        $scope.numberTargetMask = '';
        $scope.numberTargetIsDisabled = true;

        $scope.$digest();
    }
}

module.exports = Ctrl;