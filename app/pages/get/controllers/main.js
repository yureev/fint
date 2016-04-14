Ctrl.$inject = ['$scope', '$state'];
function Ctrl($scope, $state) {
    $state.go('app.get.code');
}

module.exports = Ctrl;