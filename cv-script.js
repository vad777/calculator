(function () {
    var investment_timespan = document.querySelector('#stp-clients-attracted'),
        investment_timespan_text = document.querySelector('#stp-clients-attracted-text'),
        estimated_return = document.querySelector('#stp-daily-orders-per-client'),
        estimated_return_text = document.querySelector('#stp-daily-orders-per-client-text'),
        hd = document.querySelector('[name="compound_param"]:checked').value,
        mu = document.querySelector('[name="compound_multi_param"]:checked').value,
        axis = (window.innerWidth < 981) ? 'x': 'y';


    function updateValue(element, action) {

        var min = parseFloat(element.getAttribute('min')),
            max = parseFloat(element.getAttribute('max')),
            step = parseFloat(element.getAttribute('step')) || 1,
            oldValue = element.dataset.value || element.defaultValue || 0,
            newValue = parseFloat(element.value.replace(/\$/, ''));



        if (isNaN(parseFloat(newValue))) {
            newValue = oldValue;
        } else {
            if (action == 'add') {
                newValue += step;
            } else if (action == 'sub') {
                newValue -= step;
            }

            newValue = newValue < min ? min : newValue > max ? max : newValue;
        }


        element.dataset.value = newValue;
        element.value = (element.dataset.prepend || '') + newValue + (element.dataset.append || '');

        updateChart();
    }

    function getChartData() {

        var  s = parseInt(investment_timespan.value), //storage
            t = parseInt(estimated_return.value),// transfer
            h = document.querySelector('[name="compound_param"]:checked').value,
            m = document.querySelector('[name="compound_multi_param"]:checked').value,
            labels = ["backblaze","bunny","scalway" ,"vultr"],
            colorLogo = ["red","orange","violet" ,"blue"],
            Grays = {
                label: "G",
                data: [0,0,0,0],
                minBarLength: 2,
                barPercentage: 0.5,
                maxBarThickness:20,
                backgroundColor: ['gray','gray','gray','gray'],
                borderColor: ['rgb(116 114 114)','rgb(116 114 114)','rgb(116 114 114)','rgb(116 114 114)'],
                borderWidth: 0,
                hoverOffset: 4
            },
            min = (values) => values.reduce((x, y) => Math.min(x, y));


        for (var i = 0; i < labels.length; i++) {


            if (s > 0 && i == 0) {
                Grays.data[i] = Grays.data[i] + s * 0.005;

                if (t > 0)
                    Grays.data[i] = Grays.data[i] + t * 0.01;


                if (Grays.data[i] < 7)
                    Grays.data[i] = 7;
            }

            if (s > 0  && i == 1 && h){

                Grays.data[i] = Grays.data[i] + s * h ;

                if (t > 0 ) {
                    Grays.data[i] = Grays.data[i] +  t * 0.01;
                }

                if( Grays.data[i] > 10 ) {
                    Grays.data[i] = 10;
                }
            }


            if (s > 0 && i == 2 && m){

                let s_n = 0;

                if(s > 75){
                     s_n = s - 75;
                }
                Grays.data[i] = Grays.data[i] +  s_n * m ;

                if (t > 0 ) {

                    if( t > 75 ){
                        let t_n = t - 75;
                        Grays.data[i] = Grays.data[i] +  t_n * 0.02;
                    }else{
                        Grays.data[i] = 0;
                    }

                }

            }


            if ( s > 0 && i == 3){

                Grays.data[i] = Grays.data[i] + s * 0.01;

                if ( t > 0 ) {

                    Grays.data[i] = Grays.data[i] + t * 0.01;
                }

                if(Grays.data[i] < 5){
                    Grays.data[i] = 5;
                }


            }



        }

        for (var j = 0; j < labels.length; j++) {

            let minValue  = min(Grays.data);

            if(Grays.data[j] == minValue  ){

                Grays.backgroundColor[j] = colorLogo[j];

            }

        }


        return {
            labels: labels,
            datasets: [Grays]
        }
    }

    function updateChart() {

        var data = getChartData();
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.datasets[0].data;
        chart.data.datasets[0].backgroundColor = data.datasets[0].backgroundColor;
        chart.update();
    }

    investment_timespan.addEventListener('change', function () {
        investment_timespan_text.innerHTML = this.value + ' GB';
        updateChart();
    });

    investment_timespan.addEventListener('input', function () {
        investment_timespan_text.innerHTML = this.value + ' GB';
    });


    estimated_return.addEventListener('change', function () {
        estimated_return_text.innerHTML = this.value + ' GB';
        updateChart();
    });

    estimated_return.addEventListener('input', function () {
        estimated_return_text.innerHTML = this.value + ' GB';
    });


    var radios = document.querySelectorAll('[name="compound_param"], [name="compound_multi_param"]');
    for (var r = 0; r < radios.length; r++) {
        radios[r].addEventListener('change', updateChart);
    }


    var scales = {
        x: {
            stacked: true,
        },

        y: {
            stacked: true,
        },

    };


    var option = {
        aspectRatio: 1,
        indexAxis: axis,
        interaction: {
            mode: 'index',
            axis: axis
        },
        tooltips: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';

                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            }
                            return label;
                        },
                        labelColor: function(context) {
                            return {
                                borderColor: 'rgb(0, 0, 255)',
                                backgroundColor: 'rgb(255, 0, 0)',
                                borderWidth: 2,
                                borderDash: [2, 2],
                                borderRadius: 2,
                            };
                        },
                        labelTextColor: function(context) {
                            return '#543453';
                        }
                    }
                }
            }
        },
        responsive: false,
        scales: scales
    };

    Chart.defaults.font.size = 16;
    Chart.defaults.borderColor = ["white","white"];
    Chart.defaults.backgroundColor = 'white';



    var ctx = document.getElementById('calculatorChart').getContext('2d'),
        chart = new Chart(ctx, {
            type: 'bar',
            data: getChartData(),
            options: option
        });

})();