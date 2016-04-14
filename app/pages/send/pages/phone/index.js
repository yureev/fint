require('./index.sass');

angular.module('send.phone', [])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('send.phone', {
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