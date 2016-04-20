require('./index.sass');

angular.module('get_by_code', [
    require('_modules/get_by_phone')
])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('app.code', {
                    url: '/code',
                    controller: require('./controllers/main'),
                    template: require('./templates/main.html'),
                    data: {
                        access: {}
                    }
                });
        }
    ]);

module.exports = 'get_by_code';