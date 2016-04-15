require('./index.sass');

require('./components/authentication.js');
require('./components/permissions.js');
require('./components/session.js');

angular.module('auth', [
        'authentication',
        'permissions',
        'session'
    ])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('auth', {
                    abstract: true,
                    controller: AuthCtrl,
                    template: require('./templates/auth.html')
                })
                .state('auth.init', {
                    url: '',
                    controller: InitCtrl,
                    template: require('./templates/init.html'),
                    data: {
                        access: {
                            isPublic: true
                        },
                        pageTitle: ''
                    }
                })
                .state('auth.login', {
                    url: '/login',
                    controller: LoginCtrl,
                    template: require('./templates/login.html'),
                    data: {
                        access: {
                            isPublic: true
                        },
                        pageTitle: 'Login'
                    }
                })
                .state('auth.logout', {
                    url: '/logout',
                    controller: LogoutCtrl,
                    template: require('./templates/init.html'),
                    data: {
                        pageTitle: 'Logout'
                    }
                })
                .state('auth.forgot', {
                    url: '/forgot',
                    controller: ForgotCtrl,
                    template: require('./templates/forgot.html'),
                    data: {
                        access: {
                            isPublic: true
                        },
                        pageTitle: 'Forgot Password'
                    }
                })
                .state('auth.reset', {
                    url: '/reset/:hash',
                    controller: ResetCtrl,
                    template: require('./templates/reset.html'),
                    data: {
                        access: {
                            isPublic: true
                        },
                        pageTitle: 'Reset Password'
                    }
                })
                .state('auth.403', {
                    url: '/403',
                    template: require('./templates/403.html'),
                    data: {
                        access: {
                            isPublic: true
                        },
                        pageTitle: 'You don`t have permissions'
                    }
                })
                .state('auth.404', {
                    url: '/404',
                    template: require('./templates/404.html'),
                    data: {
                        access: {
                            isPublic: true
                        },
                        pageTitle: 'Page not found'
                    }
                });
        }
    ]);

AuthCtrl.$inject = ['Restangular'];
function AuthCtrl(Restangular) {
    var baseCards = Restangular.all('cards');

    //baseCards.getList().then(function(data) {
    //	console.log(data);
    //});

    //function makeid(n) {
    //	var text = "";
    //	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    //
    //	for (var i = 0; i < n; i++)
    //		text += possible.charAt(Math.floor(Math.random() * possible.length));
    //
    //	return text;
    //}
    //
    //for (var i = 0; i < 1000; ++i) {
    //	var o = {
    //		id: 1000 + i,
    //		number: makeid(16),
    //		expire: makeid(4),
    //		cvv: makeid(3),
    //		name: 'Card name ' + makeid(5)
    //	};
    //
    //	baseCards.post(o);
    //}
}

ForgotCtrl.$inject = ['$scope', 'authentication'];
function ForgotCtrl($scope, authentication) {
}

LogoutCtrl.$inject = ['$state', 'authentication'];
function LogoutCtrl($state, authentication) {
    authentication.logout();
    $state.go('auth.login');
}

ResetCtrl.$inject = ['$scope', '$state', 'authentication'];
function ResetCtrl($scope, $state, authentication) {
}

InitCtrl.$inject = ['$state', 'authentication', 'session'];
function InitCtrl($state, authentication, session) {
    var state = session.state,
        params = session.params;

    if (session.isAuth()) {
        if (/^auth/.test(state)) {
            $state.go(session.defaultState);
        } else {
            $state.go(state, params);
        }
    } else {
        $state.go('auth.login');
    }

    return;

    authentication.getUser()
        .success(function (data) {
            if (data.status) {
                $state.go(session.state, session.params);
            } else {
                $state.go('auth.login');
            }
        })
        .error(function () {
            $state.go('auth.login');
        });
}


LoginCtrl.$inject = ['$scope', '$state', 'authentication', 'session'];
function LoginCtrl($scope, $state, authentication, session) {
    $scope.login = function () {
        if ($scope.userName === 'error') {
            $scope.error = true;
            return;
        } else {
            $scope.error = false;
        }

        authentication.login()
            .success(function (data) {
                session.user = data;

                $state.go(session.state, session.params);
            });


        return;

        authentication.login($scope.userName, $scope.userPassword, $scope.rememberMe)
            .success(function (data) {
                var status = data.status,
                    errors = data.errors;

                if (status) {
                    $state.go(session.state, session.params);
                } else {
                    errors.forEach(function (error) {
                        $scope.errors = $scope.errors | (1 << (error.code - 1000));
                    });
                }
            });
    };
}

module.exports = 'auth';