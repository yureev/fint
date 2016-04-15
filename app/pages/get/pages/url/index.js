require('./index.sass');

angular.module('get.url', [
    require('_modules/get_by_link')
])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('app.get.url', {
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