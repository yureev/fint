(function () {
    angular.module('component-page-height', [])
        .directive('pageHeight', pageHeightDirective);

    pageHeightDirective.$inject = ['$timeout', '$window', '$document', '$rootScope'];
    function pageHeightDirective($timeout, $window, $document, $rootScope) {
        return {
            restrict: 'A',
            link: postLink
        };

        function postLink(scope, element, attrs) {
            document.addEventListener("DOMContentLoaded", function() {
                console.log('DOMContentLoaded');
            });

            //$rootScope.$on('$viewContentLoaded', function() {
            //    {debugger}
            //    console.log('$viewContentLoaded');
            //});

            angular.element($window).on('resize', function() {
                console.log('resize');
                //console.log(element[0].offsetTop);
                //angular.element('body').scrollTop(0);
                //element[0].style.height = window.innerHeight - element[0].offsetTop - 100 + 'px';
            });

            //$timeout(function() {
            //    console.log('TOP:' + element[0].offsetTop);
            //    element[0].style.height = window.innerHeight - element[0].offsetTop - 100 + 'px';
            //}, 100)
        }
    }
})();

module.exports = 'component-page-height';



