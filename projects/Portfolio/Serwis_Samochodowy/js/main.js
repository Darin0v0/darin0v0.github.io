(function ($) {
    "use strict";

    const spinner = () => {
        setTimeout(() => {
            $('#spinner').removeClass('show');
        }, 1);
    };
    spinner();

    new WOW().init();

    $(window).on('scroll', function () {
        const topOffset = $(this).scrollTop() > 300 ? '0px' : '-100px';
        $('.sticky-top').css('top', topOffset);
    });

    const dropdownClass = "show";
    const handleDropdownHover = () => {
        const isDesktop = window.matchMedia("(min-width: 992px)").matches;

        $(".dropdown").off("mouseenter mouseleave");

        if (isDesktop) {
            $(".dropdown").hover(
                function () {
                    $(this).addClass(dropdownClass)
                        .find(".dropdown-toggle").attr("aria-expanded", "true")
                        .end()
                        .find(".dropdown-menu").addClass(dropdownClass);
                },
                function () {
                    $(this).removeClass(dropdownClass)
                        .find(".dropdown-toggle").attr("aria-expanded", "false")
                        .end()
                        .find(".dropdown-menu").removeClass(dropdownClass);
                }
            );
        }
    };

    $(window).on("load resize", handleDropdownHover);

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    $('.back-to-top').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });

    $('.date').datetimepicker({ format: 'L' });
    $('.time').datetimepicker({ format: 'LT' });

    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 25,
        dots: true,
        loop: true,
        nav: false,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
        }
    });

})(jQuery);
