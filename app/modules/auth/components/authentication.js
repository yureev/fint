angular.module('authentication', [])
	.provider('authentication', function () {
		return {
			$get: ['$http', '$state', 'session',
				function ($http, $state, session) {
					return {
						login: function (username, password, remeberme) {
							require('_data/user.json');

							return $http({
								method: 'GET',
								url: '/data/user.json'
							});

							return $http({
								method: 'POST',
								url: '/login',
								data: {
									username: username,
									password: password,
									rememberme: remeberme
								}
							});
						},
						logout: function () {
							return $http({
								method: 'GET',
								url: '/logout'
							}).success(function (data) {
								session.removeUser();
								$state.go('auth.login');
							});
						},
						granted: function (role) {

						},
						getUser: function () {
							return $http({
								method: 'GET',
								url: '/me/info'
							}).success(function (data) {
								var status = data.status;

								if (status) {
									session.user = data.data.user;
								}
							}).error(function () {
								console.log('error: /me/info');
							});
						},
						restorePassword: function (username) {
							return $http({
								method: 'POST',
								url: '/restore/password',
								data: {
									username: username
								}
							});
						},
						getUserByHash: function (hash) {
							return $http({
								method: 'GET',
								url: '/check/hash',
								params: {
									hash: hash
								}
							});
						},
						resetPassword: function (password, hash) {
							return $http({
								method: 'POST',
								url: '/reset/password',
								data: {
									password: password,
									hash: hash
								}
							});
						}
					}
				}
			]
		}
	});
