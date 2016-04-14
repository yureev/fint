Ctrl.$inject = ['$scope', '$state'];
function Ctrl($scope, $state) {
    $state.go('app.send.card');
}

module.exports = Ctrl;