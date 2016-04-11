require('./index.sass');

angular.module('payments', [
		require('_modules/payments/card2card')
	])
	.config(['$stateProvider',
		function ($stateProvider) {
			$stateProvider
				.state('app.payments', {
					url: '/payments',
					controller: require('./controllers/main'),
					template: require('./templates/main.html'),
					data: {
						access: {}
					}
				});
		}
	]);

module.exports = 'payments';