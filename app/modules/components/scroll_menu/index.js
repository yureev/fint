(function () {
    angular.module('component-scroll-menu', [])
        .directive('scrollMenu', scrollMenuDirective);

    scrollMenuDirective.$inject = ['$window', '$parse'];
    function scrollMenuDirective($window, $parse) {
        return {
            restrict: 'A',
            link: postLink
        };

        function postLink(scope, element, attrs) {
            var options = $parse(attrs.scrollMenu)() || {};

            var opts = angular.extend({
                appear: 200,
                scrolltime: 400,
                src: "glyphicon glyphicon-chevron-up",
                width: 45,
                place: "right",
                fadein: 500,
                fadeout: 500,
                opacity: 0.5,
                marginX: 2,
                marginY: 4
            }, options);

            element.append('<a id="goTopAnchor"><span id="goTopSpan"/></a>');

            var ga = element.children('a');
            var gs = ga.children('span');

            var css = {
                "position": "fixed",
                "display": "block",
                "width": "'" + opts.width + "px'",
                "z-index": "9",
                "bottom": opts.marginY + "%"
            };

            css[opts.place === "left" ? "left" : "right"] = opts.marginX + "%";

            element.css(css);

            //opacity
            ga.css("opacity", opts.opacity);
            gs.addClass(opts.src);
            gs.css("font-size", opts.width);
            gs.hide();

            //appear, fadein, fadeout

            angular.element($window).bind("scroll", function () {
                if ($(this).scrollMenu() > opts.appear) {
                    gs.fadeIn(opts.fadein);
                }
                else {
                    gs.fadeOut(opts.fadeout);
                }
            });

            //hover effect
            ga.hover(function () {
                element.css("opacity", "1.0");
                element.css("cursor", "pointer");
            }, function () {
                element.css("opacity", opts.opacity);
            });

            //scrolltime
            ga.click(function () {
                angular.element('body,html').animate({
                    scrollMenu: 0
                }, opts.scrolltime);
                return false;
            });
        }
    }
})();

module.exports = 'component-scroll-top';


