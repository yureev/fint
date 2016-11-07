'use strict';

// Stylesheet entrypoint
require('./index.sass');
require('./favicon.ico');

angular.module('app', [
        'ngMessages',
        'ngAnimate',
        'ui.router',
        'ui.mask',
        'restangular',
        'pascalprecht.translate',

        'angulartics',
        'angulartics.google.analytics',
        'angulartics.piwik',

        require('angular-dynamic-locale'),
        require('angular-ui-bootstrap/src/collapse'),
        require('angular-ui-bootstrap/src/tooltip'),
        require('angular-ui-bootstrap/src/buttons'),
        require('angular-ui-notification'),

        require('component-input'),
        require('component-tabindex'),
        require('component-spinner2'),
        require('component-utils'),

        require('_modules/components/scroll_to'),
        require('_modules/components/scroll_top'),
        //require('_modules/components/page-height'),
        require('_modules/components/card-height'),
        // require('_modules/auth'),
    
        require('_pages/send_to_card'),
        require('_pages/send_to_phone'),
        require('_pages/get_by_code'),
        require('_pages/get_by_url'),
        require('_pages/mobile')
    ])
    .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.NODE_ENV = process.env.NODE_ENV;

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                return;

                // var access = toState.data.access;
                //
                // if (access.isPublic) {
                //     return;
                // }
                //
                // if (session.isAuth()) {
                //     if (access.permission && !session.isGranted(access.permission)) {
                //         event.preventDefault();
                //         $state.go(session.getStateByCode('403'));
                //     }
                // }
            });
        }
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', '$translateProvider', 'tmhDynamicLocaleProvider', 'CardToCardProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, $translateProvider, tmhDynamicLocaleProvider, CardToCardProvider) {
            // $locationProvider.html5Mode({
            //     enabled: true,
            //     requireBase: false
            // });

            $urlRouterProvider
                .otherwise('/card');

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
                    url: '/link/:payLink?phone&amount',
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

            tmhDynamicLocaleProvider.localeLocationPattern('angular/i18n/angular-locale_{{locale}}.js');


            var prefix = process.env.NODE_ENV == 'development' ? 'https://send.ua' : '';

            CardToCardProvider.setUrls({
                getTariffs:                 prefix + '/sendua-external/Info/GetTariffs?tarifftype=web',
                getPayStatus:               prefix + '/sendua-external/Info/GetPayStatus',
                finishlookup:               prefix + '/sendua-external/ConfirmLookUp/finishlookup',
                getDateTime:                prefix + '/sendua-external/Info/GetDateTime',
                kvitanse:                   prefix + '/sendua-external/Info/kvitanse',
                getlinkparams:              prefix + '/sendua-external/Card2Card/getlinkparams',

                createCard2CardOperation:   prefix + '/sendua-api/Card2Card/createCard2CardOperation',

                // createCard2CardOperation:   prefix + '/sendua-external/Card2Card/CreateCard2CardOperation',

                generateLink:               prefix + '/sendua-external/Card2Card/generateLink',
                sendtomail:                 prefix + '/sendua-external/Card2Card/sendtomail',
                createCard2PhoneOperation:  prefix + '/sendua-external/Card2Phone/CreateCard2PhoneOperation',
                phone2Card:                 prefix + '/sendua-external/Phone2Card/CreatePhone2CardOperation',
                tocardlink:                 prefix + '/sendua-external/Card2Card/tocardlink',
                crossboardlink:             prefix + '/cardzone/check/',
                crossboardAmount:           prefix + '/sendua-api/cross/checkCross',
                createCross:                prefix + '/sendua-api/cross/createCross',
                getState:                   prefix + '/sendua-api/info/getState/',
                lookupContinue:             prefix + '/sendua-api/Lookup/continue/',
                getCurrencyrates:           prefix + '/sendua-api/cross/currency',
                validDiamantMaster:         prefix + '/sendua-api/cross/isDiamant',
                calc:                       prefix + '/sendua-api/Card2Card/calcCommission',

                getTariffsNew:              prefix + '/sendua-api/info/getTariffs'

            });


            CardToCardProvider.setType('web');
            CardToCardProvider.setLinkPrefix(window.location.origin + '/#/link/');
            CardToCardProvider.setRecieptTemplate(require('_templates/reciept.html'));
        }
    ])
    .controller('AppCtrl', ['$scope', '$translate', 'tmhDynamicLocale', function ($scope, $translate, tmhDynamicLocale) {
        $scope.lang = 'ua';

        $scope.onChangeLanguage = function () {
            var lang = $scope.lang;

            $translate.use(lang);
            tmhDynamicLocale.set(lang);
        };

        $translate('CARD2CARD.AMOUNT.CURRENCY').then(function (value) {
            $scope.currency = value;
        });
    }])
    .controller('LinkCtrl', ['$state', '$stateParams', function ($state, $stateParams) {
        var base64Url = require('base64-url');
        $state.go('app.card', {
            payLink: base64Url.unescape($stateParams.payLink),
            phone: $stateParams.phone,
            amount: $stateParams.amount
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