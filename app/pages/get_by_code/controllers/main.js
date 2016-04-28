Ctrl.$inject = ['$scope' ,'$translate', 'Notification'];
function Ctrl($scope, $translate, Notification) {
    window.Notification = Notification;

    $scope.$on('Card2CardReceiptSendSuccess', onCard2CardReceiptSendSuccess);
    $scope.$on('Card2CardReceiptSendError', onCard2CardReceiptSendError);

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