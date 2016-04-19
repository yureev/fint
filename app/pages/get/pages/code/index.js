require('./index.sass');

angular.module('get.code', [
    require('_modules/get_by_phone')
])
    .config(['$stateProvider',
        function ($stateProvider) {
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