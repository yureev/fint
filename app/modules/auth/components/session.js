angular.module('session', [])
	.service('session', function () {
		var user = {};

		var state = '',
			defaultState = 'app.dashboard',

			STATE_BY_CODE = {
				"403": 'auth.403',
				"404": 'auth.404'
			};

		return {
			get state() {
				if (state) {
					return state;
				}
				return defaultState;
			},
			set state(name) {
				state = name;
			},
			get defaultState() {
				return defaultState;
			},
			set user(data) {
				user = data || {};
			},
			get user() {
				return user;
			},
			get permissions() {
				return user.permissions || [];
			},
			get role() {
				return user.role_id;
			},
			get info() {
				return {
					email: user.email,
					role_id: user.role_id,
					office_id: user.office_id,
					photo_url: user.photo ? user.photo.url : null,
					get name() {
						return [user.first_name, ' ', user.last_name].join('')
					}
				};
			},
			params: null,
			isAuth: function () {
				return !!user.id;
			},
			isGranted: function (permission) {
				return permission && this.permissions.indexOf(permission) !== -1;
			},
			isGrantedByRole: function (roleKeys) {
				var roleIds;

				roleKeys = roleKeys.split(',');

				if (!roleKeys.length)
					return false;

				roleIds = roleKeys.map(function (key) {
					return roles[key];
				});

				return roleIds && roleIds.indexOf(user.role_id) !== -1;
			},
			getStateByCode: function (code) {
				return STATE_BY_CODE[code] ? STATE_BY_CODE[code] : defaultState;
			},
			removeUser: function () {
				this.state = '';
				this.user = null;
			},

			/**
			 * Compares given object with session's token.
			 */
			compare: function (obj) {
				if (!angular.isObject(obj)) {
					return false;
				}

				return this.user['id'] == obj['id'];
			},

			/**
			 * Extends given object with session's token.
			 */
			extend: function (obj) {
				// See https://docs.angularjs.org/api/ng/function/angular.copy
				var rs = angular.copy(obj, this.user);
			}
		};
	});
