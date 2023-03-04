(function ($) {
    $(function () {

        $("input[type=range]").rangeslider({polyfill: false});

        $(".js-calculator_input-wrap > .js-calculator_text-input").on("change input", function () {
            $(this).parent().find(".js-calculator_range").val($(this).val()).change();

        });

        $(".js-calculator_input-wrap > .js-calculator_range").on("change input", function () {
            $(this).parent().find(".js-calculator_text-input").val($(this).val());
        });

    });
})(jQuery);
