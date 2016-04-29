(function () {
    angular.module('component-card-height', [])
        .directive('cardHeight', cardHeightDirective);

    cardHeightDirective.$inject = ['$window'];
    function cardHeightDirective($window) {
        return {
            restrict: 'A',
            link: postLink
        };

        function postLink(scope, element) {
            resize();

            function resize() {
                var width = element[0].getBoundingClientRect().width;

                element.css({
                    'min-height': function() {
                        return (width/1.6);
                    }
                });

               //angular.element('.form-control-feedback').css('line-height', width/185);

                //angular.forEach(angular.element('.ct-input'), function(value){
                //    var a = angular.element(value);
                //    a.css('height', width/12);
                //    a.css('font-size', width/25);
                //});


                //angular.forEach(angular.element('.card-logo.mastercard'), function(value){
                //    var a = angular.element(value);
                //    a.css('height', width/16.5);
                //    a.css('width', width/10);
                //    a.css('margin-top', width/100);
                //});
            }

            angular.element($window).on('resize', function() {
                resize()
            });
        }
    }
})();

module.exports = 'component-card-height';



