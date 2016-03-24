angular.module('component-scroll', [])
	.directive('scrollTo', ['$timeout', scrollToDirective]);

module.exports = 'component-scroll';

function scrollToDirective($timeout) {
	return {
		restrict: 'A',
		link: postLink
	};

	function postLink(scope, element, attrs) {
		element.bind('click', function (event) {
			event.stopPropagation();
			var location = attrs.scrollTo;
			$timeout(function () {
				$("html, body").animate({scrollTop: $('#' + location).offset().top}, 400);
			}, 100);
		});
	}
}

