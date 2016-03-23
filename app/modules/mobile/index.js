require('./index.sass');

angular.module('mobile', [
	require('_modules/payments/card2card'),
	require('angular-ui-bootstrap/src/accordion')
])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.mobile', {
					url: '/mobile',
					template: require('./templates/main.html'),
					data: {
                        access: {}
                    }
				});
		}
	]);

module.exports = 'mobile';