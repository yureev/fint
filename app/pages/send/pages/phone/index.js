require('./index.sass');

angular.module('send.phone', [
    require('_modules/card_to_phone')
])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('app.send.phone', {
                    url: '/phone',
                    controller: require('./controllers/main'),
                    template: require('./templates/main.html'),
                    data: {
                        access: {}
                    }
                });
        }
    ]);

module.exports = 'send.phone';