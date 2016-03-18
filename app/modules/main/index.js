require('./index.sass');

angular.module('main', [
	require('_modules/payments/card2card'),
	require('angular-ui-bootstrap/src/accordion')
])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.pay', {
					url: '/',
					views: {
                        main: {
                            controller: require('./controllers/main'),
                            template: require('./templates/main.html')
                        },
                        title: {
                            template: require('./templates/title.html')
                        }
                    },
					data: {
                        access: {}
                    }
				});
		}
	]);

module.exports = 'main';