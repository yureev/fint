require('./index.sass');

angular.module('main', [])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.get.code', {
					url: '/code',
					controller: require('./controllers/main'),
					template: require('./templates/main.html'),
					data: {
                        access: {}
                    }
				});
		}
	]);

module.exports = 'get.code';