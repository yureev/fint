'use strict';

// Stylesheet entrypoint
require('_stylesheets/app.sass');

angular.module('app', [
	'ngMessages',
	'ui.router',
	'ui.mask',
	'restangular',

	require('component-input'),
	require('component-tabindex'),
	require('component-utils'),

	require('_modules/auth'),
	require('_modules/main')
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
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider',
		function ($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider) {
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false
			});

			$urlRouterProvider
				.otherwise('/');

			$stateProvider
				.state('app', {
					abstract: true,
					controller: 'AppCtrl',
					template: require('./index.html'),
					data: {
						access: {}
					}
				});

			RestangularProvider.setBaseUrl('/api');
		}
	])
	.controller('AppCtrl', AppCtrl);
		AppCtrl.$inject = ['$scope'];
		function AppCtrl($scope) {
			$scope.checkNumber = function (ctrl) {
				if (ctrl.$valid && ctrl.$modelValue.length == 16) {
					return true;
				}
			}
			$scope.checkMonth = function (ctrl) {
				if (ctrl.$valid && ctrl.$modelValue.length == 2) {
					return true;
				}
			}
			$scope.checkYear = function (ctrl) {
				if (ctrl.$valid && ctrl.$modelValue.length == 2) {
					return true;
				}
			}
			$scope.checkCvc = function (ctrl) {
				if (ctrl.$valid && ctrl.$modelValue.length == 3) {
					return true;
				}
			}
		}


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