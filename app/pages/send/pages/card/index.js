require('./index.sass');

angular.module('send.card', [
	require('_modules/cardtocard')
])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.send.card', {
					url: '/card',
					controller: require('./controllers/main'),
					template: require('./templates/main.html'),
					data: {
                        access: {}
                    }
				});
		}
	]);

module.exports = 'send.card';