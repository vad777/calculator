(function ($) {
  $(function () {
    
        $("input[type=range]").rangeslider({polyfill: false});

        var c = $("#stp-clients-attracted"),
            d = $("#stp-daily-orders-per-client");

      $(".js-calculator_input-wrap > .js-calculator_text-input").on("change input", function () {
        $(this).parent().find(".js-calculator_range").val($(this).val()).change();

      });

      $(".js-calculator_input-wrap > .js-calculator_range").on("change input", function () {
        $(this).parent().find(".js-calculator_text-input").val($(this).val());
      });

      $.fn.digits = function () {
        return this.each(function () {
          $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1'"));
        });
      };

  });
})(jQuery);
