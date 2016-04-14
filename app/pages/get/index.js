require('./index.sass');
require('./pages/code');
require('./pages/url');

angular.module('get', [])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
				.state('get', {
                    url: '/get',
                    controller: require('./controllers/main'),
                    template: require('./templates/main.html'),
                    data: {
                        access: {}
                    }
                });
        }
    ]);

module.exports = 'get';