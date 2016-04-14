require('./index.sass');

angular.module('send', [
		require('./pages/card'),
		require('./pages/phone')
	])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.send', {
					url: '/send',
					controller: require('./controllers/main'),
					template: require('./templates/main.html'),
					data: {
                        access: {}
                    }
				});
		}
	]);

module.exports = 'send';