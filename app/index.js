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
        require('_modules/components/scroll_menu'),
        //require('_modules/components/page-height'),
        require('_modules/components/card-height'),
        require('_modules/component-cardtocard'),
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



            var prefix = 'https://api.fint.online';

            // var prefix = process.env.NODE_ENV == 'development' ? 'https://send.ua' : '';

            CardToCardProvider.setUrls({
                // getDateTime:                prefix + '/sendua-api/info/GetDateTime',
                // createCard2CardOperation:   prefix + '/sendua-api/Card2Card/createCard2CardOperation',
                // createCard2PhoneOperation:  prefix + '/sendua-api/Card2Phone/createCard2PhoneOperation',
                // getPayment:                 prefix + '/sendua-api/Card2Phone/getPayment',
                // getStatePhone:              prefix + '/sendua-api/Card2Phone/getStatePhone',
                // getReceipt:                 prefix + '/sendua-api/info/getReceipt',
                // generateLink:               prefix + '/sendua-api/info/generateLink',
                // sendLinkToMail:             prefix + '/sendua-api/info/sendLinkToMail',
                // getlinkparams:              prefix + '/sendua-api/info/getLinkParams',
                // crossboardlink:             prefix + '/cardzone/check/',
                // crossboardAmount:           prefix + '/sendua-api/cross/checkCross?all=true',
                // createCross:                prefix + '/sendua-api/cross/createCross?all=true',
                // getState:                   prefix + '/sendua-api/info/getState/',
                // lookupContinue:             prefix + '/sendua-api/Lookup/continue',
                // getCurrencyrates:           prefix + '/sendua-api/cross/currency',
                // validDiamantMaster:         prefix + '/sendua-api/cross/isDiamant',
                // validDiamantMasterAll:      prefix + '/sendua-api/cross/isDiamant?all=true',
                // calc:                       prefix + '/sendua-api/Card2Card/calcCommission',
                // getTariffsNew:              prefix + '/sendua-api/info/getTariffs'

                getDateTime:                prefix + '/fint-api/info/GetDateTime',
                createCard2CardOperation:   prefix + '/fint-api/Card2Card/createCard2CardOperation',
                createCard2PhoneOperation:  prefix + '/fint-api/Card2Phone/createCard2PhoneOperation',
                getPayment:                 prefix + '/fint-api/Card2Phone/getPayment',
                getStatePhone:              prefix + '/fint-api/Card2Phone/getStatePhone',
                getReceipt:                 prefix + '/fint-api/info/getReceipt',
                generateLink:               prefix + '/fint-api/info/generateLink',
                sendLinkToMail:             prefix + '/fint-api/info/sendLinkToMail',
                getlinkparams:              prefix + '/fint-api/info/getLinkParams',
                crossboardlink:             prefix + '/cardzone/check/',
                crossboardAmount:           prefix + '/fint-api/cross/checkCross?all=true',
                createCross:                prefix + '/fint-api/cross/createCross?all=true',
                getState:                   prefix + '/fint-api/info/getState/',
                lookupContinue:             prefix + '/fint-api/Lookup/continue',
                getCurrencyrates:           prefix + '/fint-api/cross/currency',
                validDiamantMaster:         prefix + '/fint-api/cross/isDiamant',
                validDiamantMasterAll:      prefix + '/fint-api/cross/isDiamant?all=true',
                calc:                       prefix + '/fint-api/Card2Card/calcCommission',
                getTariffsNew:              prefix + '/fint-api/info/getTariffs'

            });


            CardToCardProvider.setType('web');
            CardToCardProvider.setLinkPrefix(window.location.origin + '/#/link/');
            CardToCardProvider.setRecieptTemplate(require('_templates/reciept.html'));
        }
    ])


    .controller('AppCtrl', ['$scope', '$translate', 'tmhDynamicLocale', '$window', function ($scope, $translate, tmhDynamicLocale, $window) {

        $scope.begin = true;
        $scope.onChangeBegin = function (begin) {
            $scope.begin = begin;
        };

        angular.element('#transfersmenu').addClass("activemenu");
        angular.element('#transfersline').addClass("activeline");

        angular.element($window).bind('scroll', function() {
            var transersVar = angular.element('#main')[0].getBoundingClientRect();
            var servicesVar = angular.element('#services')[0].getBoundingClientRect();
            var tarifVar = angular.element('#tarif')[0].getBoundingClientRect();
            var qaaVar = angular.element('#qaa')[0].getBoundingClientRect();
            var pcidssVar = angular.element('#pci-dss')[0].getBoundingClientRect();
            if (transersVar.top <= 200) {
                angular.element('#transfersmenu').addClass("activemenu");
                angular.element('#transfersline').addClass("activeline");
                if (servicesVar.top <= 200) {
                    angular.element('#servicesmenu').addClass("activemenu");
                    angular.element('#transfersmenu').removeClass("activemenu");
                    angular.element('#servicesline').addClass("activeline");
                    angular.element('#transfersline').removeClass("activeline");
                    if (tarifVar.top <= 200) {
                        angular.element('#tarifmenu').addClass("activemenu");
                        angular.element('#servicesmenu').removeClass("activemenu");
                        angular.element('#tarifline').addClass("activeline");
                        angular.element('#servicesline').removeClass("activeline");
                        if (qaaVar.top <= 200) {
                            angular.element('#qaamenu').addClass("activemenu");
                            angular.element('#tarifmenu').removeClass("activemenu");
                            angular.element('#qaaline').addClass("activeline");
                            angular.element('#tarifline').removeClass("activeline");
                            if (pcidssVar.top <= 200) {
                                angular.element('#pcidssmenu').addClass("activemenu");
                                angular.element('#qaamenu').removeClass("activemenu");
                                angular.element('#pcidssline').addClass("activeline");
                                angular.element('#qaaline').removeClass("activeline");
                            } else{
                                angular.element('#pcidssmenu').removeClass("activemenu");
                                angular.element('#pcidssline').removeClass("activeline");
                            }
                        } else{
                            angular.element('#qaamenu').removeClass("activemenu");
                            angular.element('#qaaline').removeClass("activeline");
                        }
                    } else{
                        angular.element('#tarifmenu').removeClass("activemenu");
                        angular.element('#tarifline').removeClass("activeline");
                    }
                } else{
                    angular.element('#servicesmenu').removeClass("activemenu");
                    angular.element('#servicesline').removeClass("activeline");
                }
            } else{
                angular.element('#transfersmenu').removeClass("activemenu");
                angular.element('#transfersline').removeClass("activeline");
            }

        });


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


