Ctrl.$inject = ['$rootScope', '$scope', '$http', '$timeout', '$window', 'CardToCard'];
function Ctrl($rootScope, $scope, $http, $timeout, $window, CardToCard) {
    var self = this,
        transaction = {};
    $scope.crossboard = false;
    $scope.crossboardText = false;
    $scope.crossboardAllowed;
    $scope.currentCurrency = 980;
    $scope.popup = false;
    $scope.point = 'web' // 'test', 'web', 'diam_web', 'diam_pay'
    $scope.target = {
        card: ''
    };
    var diamantCardMaster = false;

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

    $scope.touchNumberInput = function () {
        $timeout(function(){
            angular.element('#numberInput').focus();
        },0);
    };

    getTariffsNew();
    function getTariffsNew() {
        $scope.input_loader = true;
        $http({
            method: 'POST',
            url: CardToCard.urls.getTariffsNew,
            data: {
                "type": $scope.point
            }

        }).then(function success(response){
            var data = response.data;
            $scope.tariffs = {
                maxAmount: data.maxAmount,
                minAmount: data.minAmount,
                percent: data.percent,
                minCommission: data.minCommission,
                maxCommission: data.maxCommission,
                fixCommission: data.fixCommission,
                crossMaxAmount: data.crossMaxAmount,
                crossMinAmount: data.crossMinAmount,
                crossPercent: data.crossPercent,
                crossMinCommission: data.crossMinCommission,
                crossMaxCommission: data.crossMaxCommission,
                crossFixCommission: data.crossFixCommission,
                type: data.type
            };

                $scope.tariffs.crossMaxAmount = 1499900;

        },function errorCallback(response) {
             $scope.goState($scope.STATES.ERROR);
            }
        ).finally(function () {
            $scope.input_loader = false;
            $scope.saveTransaction(transaction);
        });

    };

    getCurrencyrates();
    function getCurrencyrates() {
        $scope.input_loader = true;
        $http({
            method: 'GET',
            url: CardToCard.urls.getCurrencyrates

        }).then(function success(response){
            $scope.currencyRate = {
                forward: response.data.forward,
                backward: response.data.backward
            };
            $scope.currencyRateYes = true;
            $scope.maxEurCross = Math.round(14999/$scope.currencyRate.forward);
            $scope.maxGrnCross = Math.round(14999);
        },function errorCallback(response) {
            $scope.currencyRateYes = false;
        }
        ).finally(function () {
            $scope.input_loader = false;
        });
    };

    // event.type должен быть keypress
    $scope.getChar = function (event, flag) {
        // console.log(event)
        if (flag == 'letters') {
            if (event.which == null) { // IE
                if ((event.keyCode > 64 && event.keyCode < 91) || (event.keyCode > 96 && event.keyCode < 123) || (event.keyCode==8) || (event.keyCode==9) || (event.keyCode==45) || (event.keyCode==46) || (event.keyCode==37) || (event.keyCode==39)) return ; // буквы
                return event.preventDefault()
            }
            if (event.which != 0 && event.charCode != 0) { // все кроме IE
                if ((event.which > 64 && event.which < 91) || (event.which > 96 && event.which < 123) || (event.which==45)) return ; // буквы
                return event.preventDefault();
            } else if ((event.which==8) || (event.keyCode==9) || (event.keyCode==46) || (event.keyCode==37) || (event.keyCode==39)){return;}
            return event.preventDefault(); // буквы

        } else if (flag == 'number'){
            if (event.which == null) { // IE
                if ((event.keyCode>47 && event.keyCode<58) || (event.keyCode==8) || (event.keyCode==9) || (event.keyCode==46) || (event.keyCode==37) || (event.keyCode==39)) return; // цифры
                return event.preventDefault()
            }
            if (event.which != 0 && event.charCode != 0) { // все кроме IE
                if (event.which > 47 && event.which < 58) return; // цифры
                return event.preventDefault();
            } else if ((event.which==8) || (event.keyCode==9) || (event.keyCode==46) || (event.keyCode==37) || (event.keyCode==39)){return;}
            return event.preventDefault(); // цифры

        } else if (flag == 'street'){
            if (event.which == null) { // IE
                if ((event.keyCode >=1040 && event.keyCode <= 1103) ) return event.preventDefault(); // цифры, буквы, пробел, слэш, дефис
                return;
            }
            if (event.which != 0 && event.charCode != 0) { // все кроме IE
                if (event.which >= 1040 && event.which <= 1103 ) return event.preventDefault(); // цифры, буквы, пробел, слэш, дефис
                return;
            } else if ((event.which==8) || (event.keyCode==9) || (event.keyCode==46) || (event.keyCode==37) || (event.keyCode==39)){return;}
            return event.preventDefault(); // цифры, буквы, пробел, слэш, дефис
        }
    };

    $scope.validAmount = function () {
        $scope.c2cForm.amount.$setValidity('errorMax', true);
        if ($scope.crossboard) {
            $scope.c2cForm.amount.$setValidity('errorMin', true);
            if ($scope.currentCurrency == 978){
                if ($scope.amount > $scope.maxEurCross){
                    $scope.c2cForm.amount.$setValidity('errorMax', false);
                } else if ($scope.amount < $scope.tariffs.crossMinAmount/100) {
                    $scope.c2cForm.amount.$setValidity('errorMin', false);
                }
            } else {
                if ($scope.amount > $scope.maxGrnCross){
                    $scope.c2cForm.amount.$setValidity('errorMax', false);
                } else if ($scope.amount < $scope.tariffs.crossMinAmount*$scope.currencyRate.forward/100) {
                    $scope.c2cForm.amount.$setValidity('errorMin', false);
                }
            }
        }
        if ($scope.amount > $scope.tariffs.maxAmount/100){
            $scope.c2cForm.amount.$setValidity('errorMax', false);
        }
    };

    $scope.getPaste = function () {
        if ($scope.nameSource){
            $scope.c2cForm.nameSource.$setValidity('errorInputCross', true);
            if (/[^a-z]/i.test($scope.nameSource)){
                $scope.c2cForm.nameSource.$setValidity('errorInputCross', false);
            }
        }
        if ($scope.surnameSource){
            $scope.c2cForm.surnameSource.$setValidity('errorInputCross', true);
            if (/[^a-z]/i.test($scope.surnameSource)){
                $scope.c2cForm.surnameSource.$setValidity('errorInputCross', false);
            }
        }
        if ($scope.country){
            $scope.c2cForm.country.$setValidity('errorInputCross', true);
            if (/[^a-z]/i.test($scope.country)){
                $scope.c2cForm.country.$setValidity('errorInputCross', false);
            }
        }
        if ($scope.city){
            $scope.c2cForm.city.$setValidity('errorInputCross', true);
            if (/[^a-z\-]/i.test($scope.city)){
                $scope.c2cForm.city.$setValidity('errorInputCross', false);
            }
        }
        if ($scope.street){
            $scope.c2cForm.street.$setValidity('errorInputCross', true);
            if (/[а-яё]/i.test($scope.street)){
                $scope.c2cForm.street.$setValidity('errorInputCross', false);
            } else {$scope.c2cForm.street.$setValidity('errorInputCross', true);}
        }
        if ($scope.postIndex){
            $scope.c2cForm.postIndex.$setValidity('errorInputCross', true);
            if (/\D/.test($scope.postIndex)){
                $scope.c2cForm.postIndex.$setValidity('errorInputCross', false);
            }
        }
        if ($scope.nameTarget){
            $scope.c2cForm.nameTarget.$setValidity('errorInputCross', true);
            if (/[^a-z]/i.test($scope.nameTarget)){
                $scope.c2cForm.nameTarget.$setValidity('errorInputCross', false);
            }
        }
        if ($scope.surnameTarget){
            $scope.c2cForm.surnameTarget.$setValidity('errorInputCross', true);
            if (/[^a-z]/i.test($scope.surnameTarget)){
                $scope.c2cForm.surnameTarget.$setValidity('errorInputCross', false);
            }
        }
        if ($scope.amount){
            $scope.c2cForm.amount.$setValidity('errorInputAmount', true);
            if (/[^0-9\s.]/.test($scope.c2cForm.amount.$viewValue)){
                $scope.c2cForm.amount.$setValidity('errorInputAmount', false);
            }
        }

        if ($scope.nameSource && $scope.surnameSource && $scope.nameTarget && $scope.surnameTarget){
            if (($scope.nameSource.toLowerCase() == $scope.nameTarget.toLowerCase()) && ($scope.surnameSource.toLowerCase() == $scope.surnameTarget.toLowerCase())){
                if ($scope.nameSource.toLowerCase() == $scope.nameTarget.toLowerCase()){
                    $scope.c2cForm.nameTarget.$setValidity('errorInputCross', false);
                } else $scope.c2cForm.nameTarget.$setValidity('errorInputCross', true);

                if ($scope.surnameSource.toLowerCase() == $scope.surnameTarget.toLowerCase()){
                    $scope.c2cForm.surnameTarget.$setValidity('errorInputCross', false);
                } else $scope.c2cForm.surnameTarget.$setValidity('errorInputCross', true);
            }
        }
    };


    $scope.convertAmount = function (code) {
        if(code == 980 && $scope.currentCurrency != code) {
            $scope.currentCurrency = 980;
            $scope.amount = Math.round($scope.currencyRate.forward * $scope.amount*100)/100;
            $scope.calculate();
        } else if (code == 978 && $scope.currentCurrency != code) {
            $scope.currentCurrency = 978;
            $scope.amount = Math.round($scope.amount *100/ $scope.currencyRate.forward)/100;
            $scope.calculate();
        }
    }
    $scope.amountEUR;
    $scope.calculate = function () {
        if ($scope.currentCurrency == 980){
            $scope.amountEUR = Math.round(($scope.amount * 100) / $scope.currencyRate.forward);
            $scope.commissCross = Math.round(($scope.amount*$scope.tariffs.crossPercent/100)*100);
            if ($scope.commissCross < $scope.tariffs.crossMinCommission) {
                $scope.commissCross = $scope.tariffs.crossMinCommission;
            } else if ($scope.commissCross > 14999) {
                $scope.commissCross = 14999;
            }

            if ($scope.amountEUR*$scope.currencyRate.forward > 1499900) {
                $scope.totalAmountCrossBeforeCheck = 0;
                $scope.amountEUR = 0;
            } else {$scope.totalAmountCrossBeforeCheck = Math.round($scope.amountEUR*$scope.currencyRate.forward + (+$scope.commissCross));}

            if ($scope.amount == 0){
                $scope.commissCross = '';
                $scope.totalAmountCrossBeforeCheck = 0;
            }
            
            
        } else {
            $scope.amountEUR = Math.round($scope.amount * 100);
            $scope.commissCross = Math.round((($scope.amount*$scope.currencyRate.forward)*$scope.tariffs.crossPercent/100)*100);

            if ($scope.commissCross < $scope.tariffs.crossMinCommission) {
                $scope.commissCross = $scope.tariffs.crossMinCommission;
            } else if ($scope.commissCross > 14999) {
                $scope.commissCross = 14999;
            }

            if ($scope.amountEUR*$scope.currencyRate.forward > 1499900) {
                $scope.totalAmountCrossBeforeCheck = 0;
                $scope.amountEUR = 0;
            } else {$scope.totalAmountCrossBeforeCheck = Math.round($scope.amountEUR*$scope.currencyRate.forward + (+$scope.commissCross));}

            if ($scope.amount == 0){
                $scope.commissCross = '';
                $scope.totalAmountCrossBeforeCheck = 0;
            }
        }
        

        if (CardToCard.urls.calc && $scope.target.phone && $scope.number && $scope.amount) {
            $scope.calcLoader = true;
            $http({
                method: 'POST',
                url: CardToCard.urls.calc,
                data: {
                    cardFrom: $scope.number,
                    cardTo: $scope.target.phone,
                    amount: $scope.amount * 100,
                    commType: $scope.point

                }
            }).then(
                function successCallback(response) {
                    $scope.commiss = response.data.commission;
                    $scope.total = ($scope.amount * 100 + $scope.commiss) / 100;
                    $scope.commiss /= 100;
                },
                function errorCallback(response) {
                    $scope.goState($scope.STATES.ERROR);
                }
            ).finally(function () {
                $scope.calcLoader = false;
            });
        } else if (CardToCard.urls.calc && $scope.target.card && $scope.number && $scope.amount && !$scope.crossboard) {
            $scope.calcLoader = true;
                $http({
                    method: 'POST',
                    url: CardToCard.urls.calc,
                    data: {
                        cardFrom: $scope.number,
                        cardTo: $scope.target.card,
                        amount: $scope.amount * 100,
                        commType: $scope.point
                    }
                }).then(
                    function successCallback(response) {
                        $scope.commiss = response.data.commission;
                        $scope.total = ($scope.amount * 100 + $scope.commiss) / 100;
                        $scope.commiss /= 100;
                    },
                    function errorCallback(response) {
                        $scope.goState($scope.STATES.ERROR);
                    }
                ).finally(function () {
                    $scope.calcLoader = false;
                });
            

        } else if (CardToCard.urls.calc && $scope.transaction.link && $scope.number && $scope.amount && !$scope.crossboard) {
            $scope.calcLoader = true;
                $http({
                    method: 'POST',
                    url: CardToCard.urls.calc,
                    data: {
                        cardFrom: $scope.number,
                        cardTo: $scope.transaction.numberTarget,
                        amount: $scope.amount * 100,
                        commType: $scope.point
                    }
                }).then(
                    function successCallback(response) {
                        $scope.commiss = response.data.commission;
                        $scope.total = ($scope.amount * 100 + $scope.commiss) / 100;
                        $scope.commiss /= 100;
                    },
                    function errorCallback(response) {
                        $scope.goState($scope.STATES.ERROR);
                    }
                ).finally(function () {
                    $scope.calcLoader = false;
                });
            

        } else {
            if ($scope.crossboard) {
                $scope.commiss = $scope.commissCross;

                if ($scope.commiss < $scope.tariffs.crossMinCommission) {
                    $scope.commiss = $scope.tariffs.crossMinCommission;
                } else if ($scope.commiss > 14999) {
                    $scope.commiss = 14999;
                }
                $scope.total = ($scope.amountCross * 100 + (+$scope.commissCross)) / 100;
                $scope.commiss /= 100;
            }

            else {
                if(diamantCardMasterAll) {
                    $scope.commiss = 0;
                } else {
                    $scope.commiss = Math.round($scope.amount * $scope.tariffs.percent + +$scope.tariffs.fixCommission);
                    if ($scope.commiss < $scope.tariffs.minCommission) {
                        $scope.commiss = $scope.tariffs.minCommission;
                    } else if ($scope.commiss > $scope.tariffs.maxCommission) {
                        $scope.commiss = $scope.tariffs.maxCommission;
                    }
                }
                // $scope.commiss = Math.round($scope.amount * $scope.tariffs.percent + +$scope.tariffs.fixCommission);
                // if ($scope.commiss < $scope.tariffs.minCommission) {
                //     $scope.commiss = $scope.tariffs.minCommission;
                // } else if ($scope.commiss > $scope.tariffs.maxCommission) {
                //     $scope.commiss = $scope.tariffs.maxCommission;
                // }

                if ($scope.amount <= $scope.tariffs.maxAmount/100 && $scope.amount != 0) {
                    $scope.total = ($scope.amount * 100 + +$scope.commiss) / 100;
                    $scope.commiss /= 100;
                } else {
                    $scope.total = '';
                    $scope.commiss ='';
                    $scope.commissCross ='';
                }
            }
        }
    };

    // angular.element(document).on('click', function (event) {
    //     $scope.popup = false;
    // });
    //
    // angular.element('#1').on('click', function (event) {
    //     $scope.popup = true;
    // });


    $scope.validDiamantMasterAll = function (numberTargetNew) {
        $scope.input_loader = true;
        if ($scope.target.card) {
            $http({
                method: 'POST',
                url: CardToCard.urls.validDiamantMasterAll,
                header: {
                    "Content-Type": "application/json"
                },
                data: {
                    "cardNumber": numberTargetNew
                }
            }).then(
                function successCallback(response) {
                    diamantCardMasterAll = response.data.diamant;
                    if (diamantCardMasterAll) {
                        $scope.commiss = 0;
                    }
                    $scope.calculate();
                },
                function errorCallback(response) {
                    // $scope.goState($scope.STATES.ERROR);
                }
            ).finally(function () {
                $scope.input_loader = false;
            });
        } else {
            $scope.input_loader = false;
        }

    };

    $scope.validDiamantMaster = function (numberSource) {
        $scope.input_loader = true;
        
        if ($scope.number) {
            $http({
                method: 'POST',
                url: CardToCard.urls.validDiamantMaster,
                header: {
                    "Content-Type": "application/json"
                },
                data: {
                    "cardNumber": numberSource
                }
            }).then(
                function successCallback(response) {
                    diamantCardMaster = response.data.diamant;
                    if ($scope.target.card && $scope.number) {
                        $scope.c2cForm.numberTarget.$setValidity('invalidNumber', true);
                        $scope.c2cForm.number.$setValidity('invalidNumber', true);
                        if ((diamantCardMaster && $scope.targetBrand == 'MAST' && $scope.targetCardZone == 'CROSS_BOARD') || (diamantCardMaster && $scope.targetBrand == 'MAES' && $scope.targetCardZone == 'CROSS_BOARD')) {
                            if ($scope.currencyRateYes){
                                $scope.crossboard = true;
                                $scope.crossboardText = false;
                                $scope.currentCurrency = 978;
                                $scope.amount = '';
                                $scope.amountEUR = '';
                                $scope.commissCross = '';
                                $scope.totalAmountCrossBeforeCheck = '';
                                $scope.nameSource = '';
                                $scope.surnameSource = '';
                                $scope.country = '';
                                $scope.city = '';
                                $scope.street = '';
                                $scope.postIndex = '';
                                $scope.notcross = false;

                            } else {
                                $scope.goState($scope.STATES.ERROR);
                            }

                        } else if ($scope.targetCardZone == 'DOMESTIC') {
                            $scope.crossboard = false;
                            $scope.crossboardText = false;
                            $scope.currentCurrency = 980;
                            $scope.notcross = false;
                            $scope.commissCross= '';
                        } else {
                            $scope.crossboard = false;
                            $scope.crossboardText = true;
                            $scope.currentCurrency = 980;
                            $scope.notcross = true;
                            // $scope.c2cForm.numberTarget.$setValidity('invalidNumber', false);
                            $scope.c2cForm.number.$setValidity('invalidNumber', false);

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
        } else {
            $scope.input_loader = false;
        }

    };

    $scope.validCardZone = function(numberSource, val) {
        $scope.input_loader = true;

        if (val == 'source') {
            if ($scope.number) {
                $http({
                    method: 'POST',
                    url: CardToCard.urls.crossboardlink,
                    header: {
                        "Content-Type": "application/json"
                    },
                    data: {
                        "cardNumber": numberSource
                    }
                }).then(
                    function successCallback(response) {
                        $scope.numberBrand = response.data.brand;
                        $scope.numberCardZone = response.data.cardZone;
                        if ($scope.numberCardZone != "DOMESTIC") {
                            $scope.c2cForm.number.$setValidity('invalidNumber', false);
                            $scope.notcross = true;
                        } else if($scope.target.card) {
                            // $scope.c2cForm.numberTarget.$setValidity('invalidNumber', true);
                            // $scope.c2cForm.number.$setValidity('invalidNumber', true);
                            if (($scope.targetBrand == 'MAST' && $scope.targetCardZone == 'CROSS_BOARD') || ($scope.targetBrand == 'MAES' && $scope.targetCardZone == 'CROSS_BOARD')) {
                                if ($scope.currencyRateYes){
                                    $scope.crossboard = true;
                                    $scope.crossboardText = false;
                                    $scope.currentCurrency = 978;
                                    $scope.amount = '';
                                    $scope.amountEUR = '';
                                    $scope.commissCross = '';
                                    $scope.totalAmountCrossBeforeCheck = '';
                                    $scope.nameSource = '';
                                    $scope.surnameSource = '';
                                    $scope.country = '';
                                    $scope.city = '';
                                    $scope.street = '';
                                    $scope.postIndex = '';
                                    $scope.notcross = false;
                                    $scope.c2cForm.number.$setValidity('invalidNumber', true);
                                } else {
                                    $scope.goState($scope.STATES.ERROR);
                                }
                            }  else if ($scope.targetCardZone == 'DOMESTIC') {
                                $scope.crossboard = false;
                                $scope.crossboardText = false;
                                $scope.currentCurrency = 980;
                                $scope.notcross = false;
                                $scope.commissCross= '';
                            } else {
                                $scope.crossboard = false;
                                $scope.crossboardText = true;
                                $scope.currentCurrency = 980;
                                $scope.notcross = true;
                                // $scope.c2cForm.numberTarget.$setValidity('invalidNumber', false);
                                $scope.c2cForm.number.$setValidity('invalidNumber', false);
                            }
                        } else {
                            $scope.c2cForm.number.$setValidity('invalidNumber', true);
                            $scope.crossboard = false;
                            $scope.crossboardText = false;
                            $scope.currentCurrency = 980;
                            $scope.notcross = false;
                            $scope.commissCross= '';
                            $scope.calculate();
                        }

                    },
                    function errorCallback(response) {
                        // $scope.goState($scope.STATES.ERROR);
                    }
                ).finally(function () {
                    $scope.input_loader = false;
                });
            } else {
                $scope.input_loader = false;
            }
        } else {
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
                        if ($scope.targetCardZone != "DOMESTIC") {
                            if ($scope.numberCardZone == "DOMESTIC") {
                                if ($scope.targetCardZone == "CROSS_BOARD" && ($scope.targetBrand == 'MAST' || $scope.targetBrand == 'MAES')){
                                    if ($scope.currencyRateYes){
                                        $scope.crossboard = true;
                                        $scope.crossboardText = false;
                                        $scope.currentCurrency = 978;
                                        $scope.amount = '';
                                        $scope.amountEUR = '';
                                        $scope.commissCross = '';
                                        $scope.totalAmountCrossBeforeCheck = '';
                                        $scope.nameTarget = '';
                                        $scope.surnameTarget = '';
                                        $scope.notcross = false;
                                        $scope.c2cForm.numberTarget.$setValidity('invalidNumber', true);
                                    } else {
                                        $scope.goState($scope.STATES.ERROR);
                                    }
                                } else {
                                    $scope.c2cForm.numberTarget.$setValidity('invalidNumber', false);
                                    $scope.notcross = true;
                                }
                            } else {
                                $scope.c2cForm.number.$setValidity('invalidNumber', false);
                                $scope.c2cForm.numberTarget.$setValidity('invalidNumber', true);
                                $scope.notcross = true;
                            }
                        } else {
                            $scope.c2cForm.numberTarget.$setValidity('invalidNumber', true);
                            $scope.crossboard = false;
                            $scope.crossboardText = false;
                            $scope.currentCurrency = 980;
                            $scope.notcross = false;
                            $scope.commissCross= '';
                            $scope.calculate();
                        }
                    },
                    function errorCallback(response) {
                        // $scope.goState($scope.STATES.ERROR);
                    }
                ).finally(function () {
                    $scope.input_loader = false;
                });
            } else {
                $scope.input_loader = false;
            }
        }
    };

    $scope.setAmount = function() {
        $scope.crossboardAllowed = false;
        
        if ($scope.amount > 0) {

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
                            $scope.commissCross = response.data.commission;
                            $scope.crossboardAllowed = true;
                            // $scope.totalAmountCross = (+$scope.amountCross);
                            $scope.totalAmountCross = (+$scope.amountCross) + (+$scope.commissCross); //Комиссия включена
                            $scope.notcross = false;
                        } else {
                            $scope.crossboardAllowed = false;
                            $scope.notcross = true;
                        }
                    },
                    function errorCallback(response) {
                        // $scope.goState($scope.STATES.ERROR);
                    }
                ).finally(function () {
                    // $scope.calcLoader = false;
                });
            } else {
                $scope.crossboardAllowed = false;
            }
            
        }
        
        
        
        // if ($scope.crossboard) {
        //     $http({
        //         method: 'POST',
        //         url: CardToCard.urls.crossboardAmount,
        //         header: {
        //             "Content-Type": "application/json"
        //         },
        //         data: {
        //             "cardFrom": $scope.number,
        //             "cardTo": $scope.target.card,
        //             "amount": $scope.amountEUR,
        //             "currency": $scope.currentCurrency
        //         }
        //     }).then(
        //         function successCallback(response) {
        //             if (response.data.message == "CROSSBOARD IS ALLOWED") {
        //                 $scope.amountCross = response.data.uaamount;
        //                 $scope.commissCross = response.data.commission;
        //                 $scope.crossboardAllowed = true;
        //                 // $scope.totalAmountCross = (+$scope.amountCross);
        //                 $scope.totalAmountCross = (+$scope.amountCross) + (+$scope.commissCross); //Комиссия включена
        //                 $scope.notcross = false;
        //             } else {
        //                 $scope.crossboardAllowed = false;
        //                 $scope.notcross = true;
        //             }
        //         },
        //         function errorCallback(response) {
        //             // $scope.goState($scope.STATES.ERROR);
        //         }
        //     ).finally(function () {
        //         // $scope.calcLoader = false;
        //     });
        // } else {
        //     $scope.crossboardAllowed = false;
        // }
    };



    function getStatePhone(operationNumber) {
        $scope.lookup_loader = true;
        $http({
            method: 'POST',
            url: CardToCard.urls.getStatePhone,
            data: {
                operationNumber: operationNumber,
                receive: false
            }
        }).then(function successCallback(response) {
            var data = response.data;
            if (data.state.code == 8 && !!data.secure) {
                transaction.secur3d = {
                    acsUrl: data.secure.ascUrl,
                    paReq: data.secure.pareq,
                    termUrl: data.secure.termUrl,
                    md: data.md
                };
                transaction.md = data.md;
                transaction.code = data.operationNumber;
                $scope.goState($scope.STATES.THREEDSEC);

            } else if (data.state.code == 7) {
                transaction.md = data.md;
                transaction.code = data.operationNumber;
                $scope.goState($scope.STATES.LOOKUP);
            } else  if (data.state.code == 2) {

                $timeout(function(){getStatePhone(data.operationNumber);},3000)



            } else {
                transaction.mPayStatus = data.message;
                transaction.operationNumber = data.operationNumber;
                $scope.goState($scope.STATES.ERROR);
            }
            $scope.saveTransaction(transaction);






            // var data = response.data,
            //     transaction = {};
            //
            //
            // if (data.state.code == 0) {
            //     // transaction.md = data.md;
            //     transaction.code = data.operationNumber;
            //
            //     $scope.goState($scope.STATES.SUCCESS);
            // }  else  if (data.state.code == 9) {
            //     $timeout(function(){getStatePhone(data.operationNumber);},3000)
            //
            // } else  {
            //     transaction.mPayStatus = data.state.code || data.state.message;
            //     transaction.operationNumber = data.operationNumber;
            //     $scope.goState($scope.STATES.ERROR);
            // }
            // $scope.saveTransaction(transaction);



        }, function errorCallback(response) {
            $scope.goState($scope.STATES.ERROR);

        }).finally(function () {

        });
    };

    function getState(operationNumber) {
        $scope.input_loader = true;
        $http({
            method: 'POST',
            url: CardToCard.urls.getState,
            data: {
                operationNumber : operationNumber
            }
        }).then(function successCallback(response) {
                var data = response.data;
                if (data.state.code == 8 && !!data.secure) {
                    transaction.secur3d = {
                        acsUrl: data.secure.ascUrl,
                        paReq: data.secure.pareq,
                        termUrl: data.secure.termUrl,
                        md: data.md
                    };
                    transaction.md = data.md;
                    transaction.code = data.operationNumber;
                    $scope.goState($scope.STATES.THREEDSEC);

                } else if (data.state.code == 7) {
                    transaction.md = data.md;
                    transaction.code = data.operationNumber;
                    $scope.goState($scope.STATES.LOOKUP);
                } else  if (data.state.code == 2) {
                        $timeout(function(){getState(data.operationNumber);},3000)
                } else {
                    transaction.mPayStatus = data.message;
                    transaction.operationNumber = data.operationNumber;
                    $scope.goState($scope.STATES.ERROR);
                }
                $scope.saveTransaction(transaction);
            }, function errorCallback(response) {
                $scope.goState($scope.STATES.ERROR);
            }
        ).finally(function () {
        });
    }

   

    this.submit = function () {
        var url;
        $scope.input_loader = true;
        
        if ($scope.crossboardAllowed) {
            url = CardToCard.urls.createCross;
            transaction.cardFrom = $scope.number.substr(0, 6) + '******' + $scope.number.substr(-4);
        } else if ($scope.transaction.link) {
            url = CardToCard.urls.createCard2CardOperation;
            transaction.cardFrom = $scope.transaction.link.substr(0, 6) + '******' + $scope.transaction.link.substr(-4);
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

            if ($scope.crossboardAllowed){
                transaction.crossboardAllowed = $scope.crossboardAllowed;
                getState(response.data.operationNumber);
                angular.extend(transaction, {
                    number: $scope.number.substr(-4),
                    amount: $scope.amountCross/100,
                    commiss: $scope.commissCross/100,
                    total: $scope.totalAmountCross/100,
                    operationNumber: data.operationNumber
                });
                transaction.numberTarget = $scope.target.card.substr(-4);
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

                     if (!$scope.transaction.link) {
                         transaction.cardToCard = true;
                         getState(response.data.operationNumber);
                     }

                } else if ($scope.transaction.link){
                    transaction.cardToCard = true;
                    transaction.numberTarget = $scope.transaction.numberTarget.substr(-4);
                    getState(response.data.operationNumber);
                } else if ($scope.target.phone) {
                    transaction.cardToPhone = true;
                    transaction.phoneTarget = $scope.target.phone;
                    transaction.cardTo = $scope.number;
                    getStatePhone(response.data.operationNumber);
                }
            }
            $scope.saveTransaction(transaction);
        }, function errorCallback(response) {
            $scope.goState($scope.STATES.ERROR);
        })
            .finally(function () {
                // $scope.input_loader = false;
            });

        function getData() {
            var d1 = {
                amount: {
                    amount: Math.round($scope.amount * 100),
                    commission: Math.round($scope.commiss * 100),
                    type: $scope.point
                },
                cardFrom: {
                    cardNumber: $scope.number,
                    dateValid: $scope.viewExpire.month + '/' + $scope.viewExpire.year,
                    cvv: $scope.cvc
                },
                phoneTo: '+380' + $scope.target.phone,
                socialNumber: '+380' + $scope.phone
            };

            var d2 = {
                ammount: {
                    summa: Math.round($scope.amount * 100),
                    commission: Math.round($scope.commiss * 100),
                    type: $scope.point
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
                    "sendPostal": $scope.postIndex,
                    "sendState":null
                }
            };

            var d4 = {
                amount: {
                    amount: Math.round($scope.amount * 100),
                    commission: Math.round($scope.commiss * 100),
                    type: $scope.point
                },
                cardFrom: {
                    cardNumber: $scope.number,
                    dateValid: $scope.viewExpire.month + '/' + $scope.viewExpire.year,
                    cvv: $scope.cvc
                },
                cardTo: $scope.transaction.link ? $scope.transaction.link : $scope.target.card,
                // cardTo: $scope.target.card,
                socialNumber: '+380' + $scope.phone
            };


            if ($scope.crossboardAllowed) {
                return d3

            } else if ($scope.transaction.link) {
                return d4
            } else if ($scope.target.card) {
                return d4
            } else return d1
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
                // md: ''
            }
        }).then(function successCallback(response) {

            var data = response.data;
            transaction.numberTarget = data.card;
            $scope.$emit('GetLinkParamsSuccess', {
                card: data.card,
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