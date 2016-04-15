require('./index.sass');

angular.module('get', [
        require('./pages/code'),
        require('./pages/url')
    ])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('app.get', {
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