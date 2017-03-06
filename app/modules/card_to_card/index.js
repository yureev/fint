require('./index.sass');

angular.module('cardToCard', [
        require('component-payments'),
        require('component-currency')
    ])
    .directive('cardToCard', cardToCardDirective)
    .directive('cardToCardInput', cardToCardInputDirective)
    .directive('cardToCardLookup', cardToCardLookupDirective)
    .directive('cardToCardError', cardToCardErrorDirective)
    .directive('cardToCardSuccess', cardToCardSuccessDirective)
    .directive('cardToCard3dsec', cardToCard3dsecDirective);

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
        template: require('./templates/input.html'),
        link: postLink
    };


    function postLink(scope) {

        scope.$on('CardToCardClearForm', onCardToCardClearForm);

        function onCardToCardClearForm() {
            scope.c2cForm.$setUntouched();
            scope.c2cForm.$setPristine();
        }

    }
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

module.exports = 'cardToCard';