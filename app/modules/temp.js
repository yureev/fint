Ctrl.$inject = ['$rootScope', '$scope', '$http', 'CardToCard'];
function Ctrl($rootScope, $scope, $http, CardToCard) {
    var self = this,
        transaction = {};
    $scope.crossboard = false;
    $scope.crossboardText = false;
    $scope.crossboardAllowed = false;
    $scope.currentCurrency = 980;
    $scope.target = {
        card: ''
    };

    $scope.$on('GetLinkParams', onGetLinkParams);
    $scope.$on('Card2CardCalculate', onCard2CardCalculate);

    $scope.submit = function () {
        self.submit();
    };

    $scope.cancel = function() {
        $scope.number = '';
        $scope.cvc = '';
        $scope.phone = '';
        $scope.target.card = '';
        $scope.target.phone = '';
        $scope.amount = '';
        $scope.viewExpire = {};

        $scope.$broadcast('CardToCardClearForm');
    };
    getCurrencyrates();

    function getCurrencyrates() {
        $http({
            method: 'GET',
            url: 'https://test.send.ua/sendua-api/cross/currency',
        }).then(function success(response){
            $scope.currencyRate = {
                forward: response.data.forward,
                backward: response.data.backward
            }
        })
    }

    // $scope.validLetters = function (input) {
    //
    //         var value = input.value;
    //         console.log(input.value);
    //         var rep = /[a-zA-Z]/;
    //         console.log(rep);
    //         if (!rep.test(value)) {
    //             value = value.replace(rep, '');
    //             input.value = value;
    //         }
    //
    // }

    $scope.convertAmount = function (code) {
        if(code == 980 && $scope.currentCurrency != code) {
            $scope.currentCurrency = 980;
            // $scope.amount = '';
            // $scope.commiss  = '';
            // $scope.total  = '';

            // $scope.totalAmountCrossBeforeCheck  = '';
            // $scope.totalAmountCross  = '';

            $scope.amount = $scope.currencyRate.forward * $scope.amount
            $scope.calculate();
        } else if (code == 978 && $scope.currentCurrency != code) {
            $scope.currentCurrency = 978;
            // $scope.amount = '';
            // $scope.commiss  = '';
            // $scope.total  = '';
            // $scope.totalAmountCrossBeforeCheck  = '';
            // $scope.totalAmountCross  = '';

            $scope.amount = $scope.amount / $scope.currencyRate.forward
            $scope.calculate();
        }
    }
    $scope.amountEUR;
    $scope.calculate = function () {

        if ($scope.currentCurrency == 980){
            $scope.amountEUR = Math.round(($scope.amount * 100) / $scope.currencyRate.forward)
            $scope.commissCross = Math.round((($scope.amount*2/100)+50)*100)
            $scope.totalAmountCrossBeforeCheck = $scope.amountEUR*$scope.currencyRate.forward + (+$scope.commissCross)
        } else {
            $scope.amountEUR = Math.round($scope.amount * 100)
            $scope.commissCross = Math.round(((($scope.amount*$scope.currencyRate.forward)*2/100)+50)*100)
            $scope.totalAmountCrossBeforeCheck = $scope.amountEUR*$scope.currencyRate.forward + (+$scope.commissCross)
        }


        if (CardToCard.urls.calc) {
            $scope.calcLoader = true;

            if ($scope.crossboard){
                $scope.commiss = $scope.commissCross;
                $scope.total = ($scope.amountCross * 100 + $scope.commissCross) / 100;
                $scope.commiss /= 100;
            } else {

                $http({
                    method: 'POST',
                    url: CardToCard.urls.calc,
                    data: {
                        cardFrom: $scope.number,
                        cardTo: $scope.target.card,
                        amount: $scope.amount * 100
                    }
                }).then(
                    function successCallback(response) {
                        $scope.commiss = response.data.comission;
                        $scope.total = ($scope.amount * 100 + $scope.commiss) / 100;
                        $scope.commiss /= 100;
                    },
                    function errorCallback(response) {
                        $scope.goState($scope.STATES.ERROR);
                    }
                ).finally(function () {
                    $scope.calcLoader = false;
                });
            }

        } else {
            if ($scope.crossboard) {
                $scope.commiss = $scope.commissCross;
                $scope.total = ($scope.amountCross * 100 + (+$scope.commissCross)) / 100;
                $scope.commiss /= 100;
            } else {

                $scope.commiss = Math.round($scope.amount * $scope.config.tariff.comm_percent + $scope.config.tariff.comm_fixed);

                if ($scope.commiss < $scope.config.tariff.total_min) {
                    $scope.commiss = $scope.config.tariff.total_min;
                } else if ($scope.commiss > $scope.config.tariff.total_max) {
                    $scope.commiss = $scope.config.tariff.total_max;
                }

                $scope.total = ($scope.amount * 100 + $scope.commiss) / 100;
                $scope.commiss /= 100;
            }
        }
    };

    $scope.validDiamantMaster = function () {
        $scope.input_loader = true;

        if ($scope.number) {
            $http({
                method: 'POST',
                url: 'https://test.send.ua/sendua-api/cross/isDiamant',
                header: {
                    "Content-Type": "application/json"
                },
                data: {
                    "cardNumber": $scope.number
                }
            }).then(
                function successCallback(response) {
                    diamantCardMaster = response.data.diamant
                    if ($scope.target.card && $scope.number) {
                        if (diamantCardMaster && $scope.targetBrand == 'MAST' && $scope.targetCardZone == 'CROSS_BOARD') {
                            $scope.crossboard = true;
                            $scope.crossboardText = false;
                            $scope.currentCurrency = 978;
                            $scope.amount = '';
                            $scope.amountEUR = '';
                            $scope.commissCross = '';
                            $scope.totalAmountCrossBeforeCheck = '';

                        } else if ($scope.targetCardZone == 'DOMESTIC') {
                            $scope.crossboard = false;
                            $scope.crossboardText = false;
                            $scope.currentCurrency = 980;
                        } else {
                            $scope.crossboard = false;
                            $scope.crossboardText = true;
                            $scope.currentCurrency = 980;
                        }
                    }
                    $scope.calculate();
                },
                function errorCallback(response) {
                    // $scope.goState($scope.STATES.ERROR);
                }
            ).finally(function () {
                $scope.input_loader = false;
            });
        }


    }

    $scope.validCardZone = function() {
        // $scope.input_loader = true;

        if ($scope.target.card) {
            $http({
                method: 'POST',
                url: CardToCard.urls.crossboardlink,
                header: {
                    "Content-Type": "application/json"
                },
                data: {
                    "cardNumber": $scope.target.card
                }
            }).then(
                function successCallback(response) {
                    $scope.targetBrand = response.data.brand;
                    $scope.targetCardZone = response.data.cardZone;

                    if ($scope.target.card && $scope.number) {
                        if (diamantCardMaster && $scope.targetBrand == 'MAST' && $scope.targetCardZone == 'CROSS_BOARD') {
                            $scope.crossboard = true;
                            $scope.crossboardText = false;
                            $scope.currentCurrency = 978;
                            $scope.amount = '';
                            $scope.amountEUR = '';
                            $scope.commissCross = '';
                            $scope.totalAmountCrossBeforeCheck = '';
                        } else if ($scope.targetCardZone == 'DOMESTIC') {
                            $scope.crossboard = false;
                            $scope.crossboardText = false;
                            $scope.currentCurrency = 980;
                        } else {
                            $scope.crossboard = false;
                            $scope.crossboardText = true;
                            $scope.currentCurrency = 980;
                        }
                    }
                    $scope.calculate();
                },
                function errorCallback(response) {
                    // $scope.goState($scope.STATES.ERROR);
                }
            ).finally(function () {
                // $scope.input_loader = false;
            });
        }


    };

    $scope.setAmount = function() {

        if ($scope.crossboard) {
            $http({
                method: 'POST',
                url: CardToCard.urls.crossboardAmount,
                header: {
                    "Content-Type": "application/json"
                },
                data: {
                    "cardFrom": $scope.number,
                    "cardTo": $scope.target.card,
                    "amount": $scope.amountEUR,
                    "currency": $scope.currentCurrency
                }
            }).then(
                function successCallback(response) {
                    if (response.data.message == "CROSSBOARD IS ALLOWED") {
                        $scope.amountCross = response.data.uaamount;
                        $scope.commissCross = response.data.comission;
                        $scope.crossboardAllowed = true;
                        $scope.totalAmountCross = (+$scope.amountCross) + (+$scope.commissCross)
                    }
                },
                function errorCallback(response) {
                    // $scope.goState($scope.STATES.ERROR);
                }
            ).finally(function () {
                // $scope.calcLoader = false;
            });
        };
    };


    function getState(operationNumber) {

        $http({
            method: 'POST',
            url: CardToCard.urls.getState,
            data: {
                payNumber : operationNumber
            }
        }).then(function successCallback(response) {
                if (data.state.code == 3) {
                    transaction.md = response.data.md;
                    transaction.code = response.data.operationNumber;

                    $scope.goState($scope.STATES.LOOKUP);
                } else  {
                    $scope.goState($scope.STATES.ERROR);
                }
            }
        )
    }



    this.submit = function () {
        var url;

        $scope.input_loader = true;

        if ($scope.crossboard) {
            url = CardToCard.urls.createCross;
            transaction.cardFrom = $scope.number.substr(0, 6) + '******' + $scope.number.substr(-4);
        } else if ($scope.transaction.link) {
            url = CardToCard.urls.tocardlink;
            transaction.cardFrom = $scope.transaction.link;
        } else if ($scope.target.card) {
            url = CardToCard.urls.createCard2CardOperation;
            transaction.cardFrom = $scope.number.substr(0, 6) + '******' + $scope.number.substr(-4);
        } else if ($scope.target.phone) {
            url = CardToCard.urls.createCard2PhoneOperation;
            transaction.cardFrom = $scope.number.substr(0, 6) + '******' + $scope.number.substr(-4);
        }




        $http({
            method: 'POST',
            url: url,
            data: getData()
        }).then(function successCallback(response) {
            var data = response.data;

            if ($scope.crossboard){
                getState(response.data.operationNumber)

            } else {


                angular.extend(transaction, {
                    number: $scope.number.substr(-4),
                    amount: $scope.amount,
                    commiss: $scope.commiss,
                    total: $scope.total,
                    operationNumber: data.idClient || data.operationNumber
                });

                if ($scope.target.card) {
                    transaction.numberTarget = $scope.target.card.substr(-4);
                } else if ($scope.target.phone) {
                    transaction.phoneTarget = $scope.target.phone;
                }

                if (data.state.code == 0 || data.state.code == 59) {
                    if (!!data.secur3d && data.secur3d.paReq == 'lookup') {
                        transaction.md = data.secur3d.md;
                        transaction.cvv = '';

                        $scope.goState($scope.STATES.LOOKUP);
                    } else if (!!data.secur3d) {


                        transaction.secur3d = {
                            acsUrl: data.secur3d.acsUrl,
                            paReq: data.secur3d.paReq,
                            termUrl: data.secur3d.termUrl,
                            md: data.secur3d.md
                        };

                        $scope.goState($scope.STATES.THREEDSEC);
                    } else {
                        //alert('Сервис временно не работает');
                    }


                } else {
                    // ERROR
                    var code = (data.state && data.state.code) || data.mErrCode;

                    transaction.mPayStatus = data.mPayStatus || data.state.message;

                    $scope.goState($scope.STATES.ERROR);
                }

                $scope.saveTransaction(transaction);
            }
        }, function errorCallback(response) {
            $scope.goState($scope.STATES.ERROR);
        })
            .finally(function () {
                $scope.input_loader = false;
            });



        function getData() {
            var d1 = {
                "ammount": {
                    "summa": Math.round($scope.amount * 100),
                    "commission": Math.round($scope.commiss * 100),
                    "type": CardToCard.type
                },


                "cardFrom": {
                    "cardNumber": $scope.number,
                    "dateValid": $scope.viewExpire.month + '/' + $scope.viewExpire.year,
                    "cvv": $scope.cvc
                },
                "mask": null,
                "socialTo": '+380' + $scope.target.phone,
                "socialNumber": '+380' + $scope.phone,
                "inputType": null,
                "mobile": null,
                "ipaddress": null,
                "version": "empty"
            };

            var d2 = {
                ammount: {
                    summa: Math.round($scope.amount * 100),
                    commission: Math.round($scope.commiss * 100),
                    type: CardToCard.type
                },
                cardFrom: {
                    cardNumber: $scope.number,
                    dateValid: $scope.viewExpire.month + '/' + $scope.viewExpire.year,
                    cvv: $scope.cvc
                },
                cardTo: $scope.transaction.link ? $scope.transaction.link : $scope.target.card,
                inputType: null,
                ipaddress: null,
                maskfrom: null,
                maskto: null,
                mobile: null,
                socialNumber: '+380' + $scope.phone,
                version: "1.0"
            };

            var d3 = {
                "cardFrom": {
                    "cardNumber": $scope.number,
                    "dateValid": $scope.viewExpire.month + '/' + $scope.viewExpire.year,
                    "cvv": $scope.cvc
                },
                "cardTo": $scope.target.card,
                "socialNumber": '+380' + $scope.phone,
                "amount": $scope.amountEUR,
                "currency": "978",
                "params": {
                    "sendName": $scope.nameSource,
                    "sendSurname": $scope.surnameSource,
                    "recName": $scope.nameTarget,
                    "recSurname": $scope.surnameTarget,
                    "sendAddress": $scope.street,
                    "sendCountry": 804,
                    "sendCity": $scope.city,
                    "sendPostal": $scope.index,
                    "sendState":null
                }
            };


            if ($scope.crossboard) {
                return d3
            } else if ($scope.target.card) {
                return d2
            } else return d1


            // return $scope.target.card ? d2 : d1
        }
    };

    function onGetLinkParams(event, data) {
        var link = data.link;

        $scope.input_loader = true;

        $http({
            method: 'POST',
            url: CardToCard.urls.getlinkparams,
            data: {
                link: link,
                md: ''
            }
        }).then(function successCallback(response) {
            var data = response.data;

            $scope.$emit('GetLinkParamsSuccess', {
                mask: data.mask,
                amount: data.amount
            });

            $scope.saveTransaction({
                link: link
            });
        }).finally(function finallyCallback() {
            $scope.input_loader = false;
            $scope.saveTransaction(transaction);
        });
    }

    function onCard2CardCalculate() {
        $scope.calculate();
    }

}

module.exports = Ctrl;



// ---------------------------


Ctrl.$inject = ['$scope', '$http', 'CardToCard'];
function Ctrl($scope, $http, CardToCard) {
    var self = this;

    $scope.submit = function () {
        self.submit();
    };


    function getState(payNumber) {
        $scope.lookup_loader = true;
        $http({
            method: 'POST',
            url: CardToCard.urls.getState,
            data: {
                payNumder: payNumber
            }
        }).then(function successCallback(response) {
            if (data.state.code == 1) {
                transaction.md = response.data.md;
                transaction.code = response.data.operationNumber;

                $scope.goState($scope.STATES.SUCCESS);
            } else  {
                $scope.goState($scope.STATES.ERROR);
            }
        }, function errorCallback(response) {
            $scope.goState($scope.STATES.ERROR);
        }).finally(function () {
            $scope.lookup_loader = false;
        });
    }

    function lookupContinue(md, code) {
        $scope.lookup_loader = true;
        $http({
            method: 'POST',
            url: CardToCard.urls.lookupContinue,
            data: {
                md: md,
                paRes: code
            }
        }).then(function successCallback(response) {
            getState(response.data.operationNumber)
        }, function errorCallback(response) {
            $scope.goState($scope.STATES.ERROR);
        }).finally(function () {
            $scope.lookup_loader = false;

        });

    }

    this.submit = function () {
        $scope.lookup_loader = true;


        if (crossboard) {
            lookupContinue($scope.transaction.md, $scope.transaction.code)
        } else {


            $http({
                method: 'POST',
                url: CardToCard.urls.finishlookup,
                data: {
                    md: $scope.transaction.md,
                    paRes: $scope.lookupCode,
                    cvv: '000'
                }
            }).then(function successCallback(response) {

                var data = response.data,
                    transaction = {};

                transaction.operationNumber = data.idClient || data.operationNumber || data.mPayNumber;

                if (data.state.code == 0) {
                    $scope.goState($scope.STATES.SUCCESS);
                } else {
                    transaction.mPayStatus = data.state.code;
                    $scope.goState($scope.STATES.ERROR);
                }

                $scope.saveTransaction(transaction);
            }, function errorCallback(response) {
                $scope.goState($scope.STATES.ERROR);
            }).finally(function () {
                $scope.lookup_loader = false;

            });
        }
    }
}

module.exports = Ctrl;