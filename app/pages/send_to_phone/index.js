require('./index.sass');

angular.module('send_to_phone', [
    require('_modules/card_to_phone')
])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('app.phone', {
                    url: '/phone',
                    controller: require('./controllers/main'),
                    template: require('./templates/main.html'),
                    data: {
                        access: {}
                    }
                });
        }
    ]);

module.exports = 'send_to_phone';