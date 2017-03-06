Ctrl.$inject = ['$scope', '$http'];
function Ctrl($scope, $http) {
    $scope.transaction = {};

    $scope.STATES = {
        INPUT: "INPUT",
        SEND: "SEND",
        ERROR: "ERROR",
        SUCCESS: "SUCCESS"
    };

    $scope.goState = function (state) {
        $scope.state = state;
    };

    $scope.saveTransaction = function (transaction) {
        angular.extend($scope.transaction, transaction);
    };
    
    init();

    function init() {
        $scope.goState($scope.STATES.INPUT);
    }
}

module.exports = Ctrl;