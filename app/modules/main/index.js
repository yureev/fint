require('./index.sass');

angular.module('main', [
	require('_modules/payments/card2card'),
		require('_modules/components/scroll-to'),
	require('angular-ui-bootstrap/src/accordion')
])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.main', {
					url: '/',
					controller: require('./controllers/main'),
					template: require('./templates/main.html'),
					data: {
                        access: {}
                    }
				});
		}
	]);

module.exports = 'main';