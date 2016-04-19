require('./index.sass');

angular.module('getByLink', [
        require('component-payments'),
        require('component-currency'),
        require('component-cardtocard')
    ])
    .directive('getByLink', getByLinkDirective)
    .directive('getByLinkInput', getByLinkInputDirective)
    .directive('getByLinkSend', getByLinkSendDirective)
    .directive('getByLinkError', getByLinkErrorDirective)
    .directive('getByLinkSuccess', getByLinkSuccessDirective);

function getByLinkDirective() {
    return {
        restrict: 'A',
        controller: 'getByLink',
        template: require('./templates/main.html')
    };
}

function getByLinkInputDirective() {
    return {
        restrict: 'A',
        controller: 'getByLinkInput',
        template: require('./templates/input.html')
    };
}

function getByLinkSendDirective() {
    return {
        restrict: 'A',
        controller: 'getByLinkSend',
        template: require('./templates/send.html')
    };
}

function getByLinkErrorDirective() {
    return {
        restrict: 'A',
        template: require('./templates/error.html')
    };
}

function getByLinkSuccessDirective() {
    return {
        restrict: 'A',
        template: require('./templates/success.html')
    };
}

module.exports = 'getByLink';