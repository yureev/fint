angular.module('component-currency', [])
	.directive('ctCurrency', ctCurrencyDirective);

module.exports = 'component-currency';

function ctCurrencyDirective() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: postLink
	};

	function postLink(scope, element, attrs, ngModelCtrl) {
		if (!ngModelCtrl)
			throw new Error("ct-currency should have ng-model!");

		ngModelCtrl.$parsers.push(parser);
		ngModelCtrl.$formatters.push(formatter);

		if (attrs.min) {
			ngModelCtrl.$validators.min = function(value) {
				return parseFloat(attrs.min) <= value;
			}
		}

		if (attrs.max) {
			ngModelCtrl.$validators.max = function(value) {
				return parseFloat(attrs.max) >= value;
			}
		}

		element.on('focus click', onFocus);

		element.on('keydown', onKeyDown);

		element.on('keyup', onKeyUp);

		function parser(viewValue) {
			viewValue = viewValue
				.replace(/,/g, '');

			return parseFloat(viewValue);
		}

		function formatter(modelValue) {
			if (modelValue) {

			} else {
				modelValue = '0.00'
			}

			return modelValue;
		}

		function onFocus() {
			var value = element.val(),
				elemDOM = element[0],
				pos,
				dotPos = value.indexOf('.');

			setTimeout(function() {
				pos = elemDOM.selectionStart;

				//selectint
				if (pos <= dotPos && !ngModelCtrl.$modelValue) {
					elemDOM.setSelectionRange(0, dotPos);

					return;
				}

				if (pos > dotPos) {
					elemDOM.setSelectionRange(dotPos + 1, value.length + 1);
				}
			}, 10)
		}

		function onKeyDown(e) {
			var char = String.fromCharCode(e.keyCode);

			if (!char.match(/\./)) {
				return;
			}

			if (char.match(/[^\.|\d]/)) {
				e.preventDefault();
			}
		}

		function onKeyUp(e) {
			var value, formated, intVal, decVal,
				elemDOM = element[0],
				lastComma, index, pos;

			if (e.keyCode == 32)
				return;

			pos = elemDOM.selectionStart;

			value = element.val();
			formated = value.replace(/,/g, '').split('.');
			intVal = formated[0];
			decVal = formated[1];

			if (decVal.length > 2) {
				decVal = decVal.substr(0, 2);
			}

			intVal = intVal
				.split('');

			for (var i = Math.floor(intVal.length / 3); i > 0; --i) {
				lastComma = intVal.indexOf(',');

				if (lastComma == -1) {
					index = intVal.length - 3;
				} else {
					index = lastComma - 3;
				}

				if (index === 0) {
					break;
				}

				intVal.splice(index, 0, ',');
			}

			formated = intVal.join('') + '.' + decVal;

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