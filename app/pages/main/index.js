require('./index.sass');

angular.module('main', [
		require('_modules/payments/cardtocard'),
	require('_modules/components/scroll_to'),
	require('angular-ui-bootstrap/src/accordion')
])
	.config(['$stateProvider',
		function($stateProvider) {
			console.log('asdasdasd');


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