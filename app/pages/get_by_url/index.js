require('./index.sass');

angular.module('get_by_url', [
    require('_modules/get_by_link')
])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('app.url', {
                    url: '/url',
                    controller: require('./controllers/main'),
                    template: require('./templates/main.html'),
                    data: {
                        access: {}
                    }
                });
        }
    ]);

module.exports = 'get_by_url';