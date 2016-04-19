require('./index.sass');

angular.module('cardToPhone', [
        require('component-payments'),
        require('component-currency'),
        require('component-cardtocard')
    ])
    .config(config)
    .directive('cardToPhone', cardToPhoneDirective)
    .directive('cardToPhoneInput', cardToPhoneInputDirective)
    .directive('cardToPhoneLookup', cardToPhoneLookupDirective)
    .directive('cardToPhoneError', cardToPhoneErrorDirective)
    .directive('cardToPhoneSuccess', cardToPhoneSuccessDirective)
    .directive('cardToPhone3dsec', cardToPhone3dsecDirective);

config.$inject = ['CardToCardProvider'];
function config(CardToCardProvider) {
    var prefix = process.env.NODE_ENV == 'development' ? 'https://send.ua' : '';

    CardToCardProvider.setUrls({
        phone2Card: prefix + '/sendua-external/Phone2Card/CreatePhone2CardOperation'
    });
}

function cardToPhoneDirective() {
    return {
        restrict: 'A',
        controller: 'CardToCard',
        template: require('./templates/main.html')
    };
}

function cardToPhoneInputDirective() {
    return {
        restrict: 'A',
        controller: 'CardToCardInput',
        template: require('./templates/input.html')
    };
}

function cardToPhoneLookupDirective() {
    return {
        restrict: 'A',
        template: require('./templates/lookup.html'),
        controller: 'CardToCardLookup'
    };
}

function cardToPhoneSuccessDirective() {
    return {
        restrict: 'A',
        template: require('./templates/success.html'),
        controller: 'CardToCardSuccess'
    };
}

function cardToPhoneErrorDirective() {
    return {
        restrict: 'A',
        template: require('./templates/error.html')
    };
}

function cardToPhone3dsecDirective() {
    return {
        restrict: 'A',
        template: require('./templates/3dsec.html'),
        controller: 'CardToCard3dsecure'
    };
}

module.exports = 'cardToPhone';