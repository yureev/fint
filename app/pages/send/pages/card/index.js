require('./index.sass');

angular.module('main', [])
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