'use strict';

// Stylesheet entrypoint
require('./index.sass');

angular.module('app', [
        'ngMessages',
        'ngAnimate',
        'ui.router',
        'ui.mask',
        'restangular',
        'pascalprecht.translate',

        require('angular-dynamic-locale'),
        require('angular-ui-bootstrap/src/tooltip'),

        require('component-input'),
        require('component-tabindex'),
        require('component-spinner2'),
        require('component-utils'),

        require('_modules/auth'),

        require('_pages/send'),
        require('_pages/get'),
        require('_pages/mobile')
    ])
    .run(['$rootScope', '$state', '$stateParams', 'session',
        function ($rootScope, $state, $stateParams, session) {
            window.$rootScope = $rootScope;

            $rootScope.NODE_ENV = process.env.NODE_ENV;

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                return;

                var access = toState.data.access;

                if (access.isPublic) {
                    return;
                }

                if (session.isAuth()) {
                    if (access.permission && !session.isGranted(access.permission)) {
                        event.preventDefault();
                        $state.go(session.getStateByCode('403'));
                    }
                }
            });
        }
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', '$translateProvider', 'tmhDynamicLocaleProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, $translateProvider, tmhDynamicLocaleProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });

            $urlRouterProvider
                .otherwise('/send/card');

            $stateProvider
                .state('app', {
                    abstract: true,
                    template: require('./index.html'),
                    controller: 'AppCtrl',
                    resolve: {
                        locale: ['tmhDynamicLocale', function (tmhDynamicLocale) {
                            return tmhDynamicLocale.set('ua');
                        }]
                    }
                })
                .state('link', {
                    url: '/link/:payLink',
                    controller: 'LinkCtrl'
                });

            RestangularProvider.setBaseUrl('/api');

            require('_data/locale-ua.json');
            require('_data/locale-ru.json');

            $translateProvider.useStaticFilesLoader({
                prefix: '/data/locale-',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('ua');

            tmhDynamicLocaleProvider.localeLocationPattern('/angular/i18n/angular-locale_{{locale}}.js');
        }
    ])
    .controller('AppCtrl', ['$scope', '$translate', 'tmhDynamicLocale', function ($scope, $translate, tmhDynamicLocale) {
        var lang = 'ua';

        $scope.changeLanguage = function () {
            lang = lang == 'ua' ? 'ru' : 'ua';

            $translate.use(lang);
            tmhDynamicLocale.set('ua');
        };

        $translate('CARD2CARD.AMOUNT.CURRENCY').then(function (value) {
            $scope.currency = value;
        });
    }])
    .controller('LinkCtrl', ['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
        $state.go('app.send.card', {
            payLink: $stateParams.payLink
        });
    }]);

$(document).ready(function () {
    require('_data/permissions.json');
    var dPermissions = $.ajax('/data/permissions.json')
        .then(function (response) {
            window.permissions = response;
        });

    require('_data/roles.json');
    var dRoles = $.ajax('/data/roles.json')
        .then(function (response) {
            window.roles = response;
        });

    $.when(dPermissions, dRoles).done(function (v1, v2) {
        angular.bootstrap(document, ['app']);
    });
});