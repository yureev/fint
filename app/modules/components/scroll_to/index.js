(function () {
    angular.module('component-scroll', [])
        .directive('scrollTo', scrollToDirective);

    scrollToDirective.$inject = ['$timeout'];
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
})();

module.exports = 'component-scroll';


