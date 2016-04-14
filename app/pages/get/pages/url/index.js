require('./index.sass');

angular.module('get.url', [])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('get.url', {
					url: '/url',
					controller: require('./controllers/main'),
					template: require('./templates/main.html'),
					data: {
                        access: {}
                    }
				});
		}
	]);

module.exports = 'get.url';