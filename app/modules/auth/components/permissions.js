angular.module('permissions', [])
	.service('permissions', ['session',
		function (session) {
			return function (permissions) {
				var userPermissions = session.permissions;

				if (typeof permissions == 'string') {
					return userPermissions.indexOf(permissions) != -1;
				} else {
					return false;
				}
			}
		}]
	);