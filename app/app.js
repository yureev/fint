'use strict';

// Stylesheet entrypoint
require('_stylesheets/app.sass');

angular.module('app', [
	'ngMessages',
	'ngAnimate',
	'ui.router',
	'ui.mask',
	'restangular',
	'pascalprecht.translate',

	require('component-input'),
	require('component-tabindex'),
	require('component-spinner2'),
	require('component-utils'),

	require('_modules/auth'),
	require('_modules/main'),
	require('_modules/mobile')
])
	.run(['$rootScope', '$state', '$stateParams', 'session',
		function ($rootScope, $state, $stateParams, session) {
			var $body = angular.element('body');

			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
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
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', '$translateProvider',
		function ($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, $translateProvider) {
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false
			});

			$urlRouterProvider
				.otherwise('/');

			$stateProvider
				.state('app', {
					abstract: true,
					template: require('./index.html'),
					controller: 'AppCtrl',
					controllerAs: 'ac',
					data: {
						access: {}
					}
				});

			RestangularProvider.setBaseUrl('/api');

			require('_data/locale-ua.json');
			require('_data/locale-ru.json');

			$translateProvider.useStaticFilesLoader({
				prefix: '/data/locale-',
				suffix: '.json'
			});
			$translateProvider.preferredLanguage('ua');
		}
	])
	.controller('AppCtrl', ['$scope', '$translate', function($scope, $translate) {
		var langKey = 'ua';
		$scope.lang = 'lang ua';
		this.changeLanguage = function () {
			if (langKey == 'ua') {
				langKey = 'ru';
				$scope.lang = 'lang ru';
				$translate.use(langKey);
			}
			else {
				langKey = 'ua';
				$scope.lang = 'lang ua';
				$translate.use(langKey);
			}
		};
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