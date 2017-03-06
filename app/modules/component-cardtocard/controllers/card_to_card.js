Ctrl.$inject = ['$scope', '$http', 'CardToCard'];
function Ctrl($scope, $http, CardToCard) {
    $scope.config = {
        tariff: null,
        tariffType: 'other'
    };

    $scope.transaction = {};

    $scope.STATES = {
        INPUT: "INPUT",
        ERROR: "ERROR",
        LOOKUP: "LOOKUP",
        SUCCESS: "SUCCESS",
        THREEDSEC: "THREEDSEC",
        PHONE_TO_CARD_input: "PHONE_TO_CARD_INPUT",
        PHONE_TO_CARD_CONFIRM: "PHONE_TO_CARD_CONFIRM"
    };

    $scope.goState = function (state) {
        $scope.state = state;
    };

    $scope.saveTransaction = function (transaction) {
        angular.extend($scope.transaction, transaction);
    };

    // $scope.getTariffs = function () {
    //     $scope.tariffs_loader = true;
    //
    //     $http.get(CardToCard.urls.getTariffs)
    //         .then(function (response) {
    //             var data = response.data;
    //             angular.forEach(data, function (tariff) {
    //                 if (tariff.card_type == $scope.config.tariffType) {
    //                     $scope.config.tariff = tariff;
    //                 }
    //             });
    //
    //         })
    //         .finally(function () {
    //             $scope.tariffs_loader = false;
    //         });
    // };

    init();

    function init() {
        $scope.goState($scope.STATES.INPUT);
        // $scope.getTariffs();
    }
}

module.exports = Ctrl;