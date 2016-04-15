angular.module('component-currency', [])
    .filter('ctCurrency', ctCurrencyFilter)
    .directive('ctCurrency', ['CtUtils', ctCurrencyDirective]);

function ctCurrencyFilter() {
    return function (value) {
        var formated, intVal, decVal,
            lastComma, index;

        value = typeof value == 'number' ? value.toString() : value;

        formated = value.replace(/ /g, '').split('.');
        intVal = formated[0];
        decVal = formated[1] || '00';

        if (decVal.length > 2) {
            decVal = decVal.substr(0, 2);
        }

        intVal = intVal
            .split('');

        for (var i = Math.floor(intVal.length / 3); i > 0; --i) {
            lastComma = intVal.indexOf(' ');

            if (lastComma == -1) {
                index = intVal.length - 3;
            } else {
                index = lastComma - 3;
            }

            if (index === 0) {
                break;
            }

            intVal.splice(index, 0, ' ');
        }

        formated = intVal.join('') + '.' + decVal;

        return formated
    }
}

function ctCurrencyDirective(CtUtils) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: postLink
    };

    function postLink(scope, element, attrs, ngModelCtrl) {
        var keyPressed;

        if (!ngModelCtrl)
            throw new Error("ct-currency should have ng-model!");

        ngModelCtrl.$parsers.push(parser);
        ngModelCtrl.$formatters.push(formatter);

        if (attrs.min) {
            ngModelCtrl.$validators.min = function (value) {
                return parseFloat(attrs.min) <= value;
            }
        }

        if (attrs.max) {
            ngModelCtrl.$validators.max = function (value) {
                return parseFloat(attrs.max) >= value;
            }
        }

        element.on('focus', onFocus);

        element.on('keypress', onKeyPress);

        element.on('keyup', onKeyUp);

        function parser(viewValue) {
            viewValue = viewValue
                .replace(/ /g, '');

            return parseFloat(viewValue);
        }

        function formatter(modelValue) {
            if (modelValue) {

            } else {
                modelValue = '0'
            }

            return modelValue;
        }

        function onFocus() {
            var value = element.val(),
                elemDOM = element[0];

            setTimeout(function () {
                elemDOM.setSelectionRange(0, value.length + 1);
            }, 10)
        }

        function onKeyPress(e) {
            var char = CtUtils.getChar(e);

            keyPressed = true;

            if (!char.match(/./)) {
                return;
            }

            if (!char.match(/\d/)) {
                e.preventDefault();
            }
        }


        function onKeyUp(e) {
            var value, formated,
                elemDOM = element[0],
                lastComma, index, pos;

            if (keyPressed) {
                keyPressed = false;
            } else {
                return;
            }

            if (e.keyCode == 32)
                return;

            pos = elemDOM.selectionStart;

            value = element.val();
            formated = value.replace(/ /g, '').split('');

            for (var i = Math.floor(formated.length / 3); i > 0; --i) {
                lastComma = formated.indexOf(' ');

                if (lastComma == -1) {
                    index = formated.length - 3;
                } else {
                    index = lastComma - 3;
                }

                if (index === 0) {
                    break;
                }

                formated.splice(index, 0, ' ');
            }

            formated = formated.join('');

            ngModelCtrl.$setViewValue(formated);
            ngModelCtrl.$render();

            pos = updatePosition(value, formated, pos);

            elemDOM.setSelectionRange(pos, pos);
        }

        function updatePosition(value, formated, pos) {
            if (value === formated)
                return pos;

            return pos + (formated.length - value.length);
        }
    }
}

module.exports = 'component-currency';