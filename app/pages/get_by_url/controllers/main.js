Ctrl.$inject = ['$scope'];
function Ctrl($scope) {
    $scope.checkNumber = function (ctrl) {
        if (ctrl.$valid && ctrl.$modelValue && ctrl.$modelValue.length == 16) {
            return true;
        }
    };
    $scope.checkPhone = function (ctrl) {
        if (ctrl.$valid && ctrl.$modelValue && ctrl.$modelValue.length == 9) {
            return true;
        }
    };
}

module.exports = Ctrl;