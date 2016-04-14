require('./index.sass');
require('./pages/card');
require('./pages/phone');

angular.module('send', [])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('send', {
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