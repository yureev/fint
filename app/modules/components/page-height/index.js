(function () {
    angular.module('component-page-height', [])
        .directive('pageHeight', pageHeightDirective);

    pageHeightDirective.$inject = ['$timeout', '$window', '$document', '$rootScope'];
    function pageHeightDirective($timeout, $window, $document, $rootScope) {
        return {
            restrict: 'A',
            link: postLink
        };

        function postLink(scope, element) {
            var elem = element.find('[page-height-container]');

            angular.element($window).on('resize', function() {
                calculate();
            });

            $timeout(function() {
                calculate();
            }, 10);

            function calculate() {
                var offset = elem.offset().top,
                    height = elem.height(),
                    windowHeight = angular.element($window).height(),

                    expand = windowHeight - offset - height;

                if (expand > 0) {
                    element.height(height + expand);
                }
            }
        }
    }
})();

module.exports = 'component-page-height';



