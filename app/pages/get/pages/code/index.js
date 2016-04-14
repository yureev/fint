require('./index.sass');

angular.module('get.code', [])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('get.code', {
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