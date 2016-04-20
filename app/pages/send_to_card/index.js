require('./index.sass');

angular.module('send_to_card', [
        require('_modules/card_to_card')
    ])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('app.card', {
                    url: '/card',
                    controller: require('./controllers/main'),
                    template: require('./templates/main.html'),
                    params: {
                        payLink: null
                    }
                });
        }
    ]);

module.exports = 'send_to_card';