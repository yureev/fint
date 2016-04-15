require('./index.sass');

angular.module('cardToCard', [
        require('component-payments'),
        require('component-currency'),
        require('component-cardtocard')
    ])
    .config(config)
    .directive('cardToCard', cardToCardDirective)
    .directive('cardToCardInput', cardToCardInputDirective)
    .directive('cardToCardLookup', cardToCardLookupDirective)
    .directive('cardToCardError', cardToCardErrorDirective)
    .directive('cardToCardSuccess', cardToCardSuccessDirective)
    .directive('cardToCard3dsec', cardToCard3dsecDirective)
    .directive('amount', amountDirective);

config.$inject = ['CardToCardProvider'];
function config(CardToCardProvider) {
    var prefix = process.env.NODE_ENV == 'development' ? 'https://send.ua' : '';

    CardToCardProvider.setUrls({
        getTariffs: prefix + '/sendua-external/Info/GetTariffs?tarifftype=web',
        getPayStatus: prefix + '/sendua-external/Info/GetPayStatus',
        createCard2CardOperation: prefix + '/sendua-external/Card2Card/CreateCard2CardOperation',
        finishlookup: prefix + '/sendua-external/ConfirmLookUp/finishlookup',
        getDateTime: prefix + '/sendua-external/Info/GetDateTime'
    });
}

function cardToCardDirective() {
    return {
        restrict: 'A',
        controller: 'CardToCard',
        template: require('./templates/main.html')
    };
}

function cardToCardInputDirective() {
    return {
        restrict: 'A',
        controller: 'CardToCardInput',
        template: require('./templates/input.html')
    };
}

function cardToCardLookupDirective() {
    return {
        restrict: 'A',
        template: require('./templates/lookup.html'),
        controller: 'CardToCardLookup'
    };
}

function cardToCardSuccessDirective() {
    return {
        restrict: 'A',
        template: require('./templates/success.html'),
        controller: 'CardToCardSuccess'
    };
}

function cardToCardErrorDirective() {
    return {
        restrict: 'A',
        template: require('./templates/error.html')
    };
}

function cardToCard3dsecDirective() {
    return {
        restrict: 'A',
        template: require('./templates/3dsec.html'),
        controller: 'CardToCard3dsecure'
    };
}


function amountDirective() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: postLink
    };

    function postLink(scope, element, attr, ModelCtrl) {
        ModelCtrl.$formatters.push(check);
        ModelCtrl.$parsers.push(check);

        function check(value) {
            if (!value) {
                value = 0;
            }

            return value;
        }
    }
}

module.exports = 'cardToCard';