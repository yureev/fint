Ctrl.$inject = ['$scope', '$state'];
function Ctrl($scope, $state) {
    $state.go('app.get.url');
}

module.exports = Ctrl;