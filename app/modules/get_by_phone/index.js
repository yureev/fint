require('./index.sass');

angular.module('getByPhone', [
        require('component-payments'),
        require('component-currency')
    ])
    .directive('getByPhone', getByPhoneDirective)
    .directive('getByPhoneError', getByPhoneErrorDirective)
    .directive('getByPhoneSuccess', getByPhoneSuccessDirective)
    .directive('getByPhoneInput', getByPhoneInputDirective)
    .directive('getByPhoneConfirm', getByPhoneConfirmDirective);

function getByPhoneDirective() {
    return {
        restrict: 'A',
        controller: 'CardToCard',
        template: require('./templates/main.html'),
        link: postLink
    };

    function postLink(scope) {
        scope.state = scope.STATES.PHONE_TO_CARD_INPUT;
    }
}

function getByPhoneSuccessDirective() {
    return {
        restrict: 'A',
        template: require('./templates/success.html'),
        controller: 'CardToCardSuccess'
    };
}

function getByPhoneErrorDirective() {
    return {
        restrict: 'A',
        template: require('./templates/error.html')
    };
}

function getByPhoneInputDirective() {
    return {
        restrict: 'A',
        template: require('./templates/phone_input.html'),
        controller: 'PhoneToCardInput'
    };
}

function getByPhoneConfirmDirective() {
    return {
        restrict: 'A',
        template: require('./templates/phone_confirm.html'),
        controller: 'PhoneToCardConfirm'
    };
}

module.exports = 'getByPhone';