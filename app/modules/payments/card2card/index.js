require('./index.sass');

angular.module('card2card', [
	require('component-payments'),
	require('_modules/components/currency')
])
	.directive('card2card', card2cardDirective);

module.exports = 'card2card';

function card2cardDirective() {
	return {
		restrict: 'A',
		link: postLink,
		template: require('./templates/main.html')
	};

	function postLink(scope, element, attrs) {
		scope.$watch('c2cForm', function() {
			window.c2cForm = scope.c2cForm;
		})
	}
}