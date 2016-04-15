require('./index.sass');

angular.module('send.card', [
        require('_modules/card_to_card')
    ])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('app.send.card', {
                    url: '/card',
                    controller: require('./controllers/main'),
                    template: require('./templates/main.html'),
                    params: {
                        payLink: null
                    }
                });
        }
    ]);

module.exports = 'send.card';