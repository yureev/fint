require('./index.sass');

angular.module('main', [])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.send.phone', {
					url: '/phone',
					controller: require('./controllers/main'),
					template: require('./templates/main.html'),
					data: {
                        access: {}
                    }
				});
		}
	]);

module.exports = 'send.phone';