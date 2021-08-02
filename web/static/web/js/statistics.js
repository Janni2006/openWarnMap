$(function () {
    var $yearlyChart = $("#yearly_chart");
    var $monthlyChart = $("#monthly_chart");

    var ctx = $yearlyChart[0].getContext("2d");
    $(".chart button").click(function(){
        var substrings = $monthlyChart.data("url").split('/');
        var test_url = "/";
        for(var x = 1; x < substrings.length-1; x++){
            test_url += substrings[x];
            test_url += "/"
        }
        test_url += $(this).val();
        console.log(test_url)
        $.ajax({
            url: test_url,
            success: function (data) {
                updateMonthly(data, test_url);
            }
        });
    });
    var yearly_chart = new Chart(ctx, {
        type: 'pie',
        data: {
        datasets: [{
        }]          
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
            },
            onClick: yearlyClickHandler,
        }
    });

    function updateMonthly(data, url){
        $("#monthly_chart_container").html('<canvas id="monthly_chart" data-url="' + url + '"></canvas>');
        $monthlyChart = $('#monthly_chart');

        console.log($monthlyChart)

        ctx = $monthlyChart[0].getContext("2d");

        monthly_chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.monthly.labels,
                datasets: [{
                    label: 'Public Issues',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(60,186,159)',
                    borderWidth: 2,
                    data: data.monthly.public,
                },
                {
                    label: 'Public Issues',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(255,0,0)',
                    borderWidth: 2,
                    data: data.monthly.private,
                }]          
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false,
                    position: 'top',
                },
                title: {
                    display: false,
                },
            }
        });
    }

    function yearlyClickHandler(evt) {
        var firstpoint = yearly_chart.getElementAtEvent(evt)[0];

        if (firstpoint !== undefined){
            var substrings = $monthlyChart.data("url").split('/');
            var test_url = "/";
            for(var x = 1; x < substrings.length-1; x++){
                test_url += substrings[x];
                test_url += "/"
            }
            test_url += firstpoint._model.label;
            console.log(test_url);
            $.ajax({
                url: test_url,
                success: function (data) {
                    updateMonthly(data, test_url);
                }
            });
        }
    }
    var ctx = $monthlyChart[0].getContext("2d");

    var monthly_chart = new Chart(ctx, {
        type: 'line',
        data: {
        datasets: [{
            label: 'Public Issues',
            backgroundColor: 'transparent',
            borderColor: 'rgb(60,186,159)',
            borderWidth: 2,
        },
        {
            label: 'Public Issues',
            backgroundColor: 'transparent',
            borderColor: 'rgb(255,0,0)',
            borderWidth: 2,
        }]          
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
            },
        }
    });

    $.ajax({
        url: $yearlyChart.data("url"),
        success: function (data) {
            monthly_chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.monthly.labels,
                datasets: [{
                    label: 'Public Issues',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(60,186,159)',
                    borderWidth: 2,
                    data: data.monthly.public,
                },
                {
                    label: 'Public Issues',
                    backgroundColor: 'transparent',
                    borderColor: 'rgb(255,0,0)',
                    borderWidth: 2,
                    data: data.monthly.private,
                }]          
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: false,
                        position: 'top',
                    },
                    title: {
                        display: false,
                    },
                }
            });
            monthly_chart.update();

            var COLORS = interpolateColors(data.yearly.values.length, d3.interpolateInferno, {colorStart: 0, colorEnd: 1, useEndASStart: false});

            $("#yearly_chart_container").html("");
            $("#yearly_chart_container").append("<canvas id='yearly_chart'></canvas>");

            $yearlyChart = $("#yearly_chart");

            ctx = $yearlyChart[0].getContext("2d");

            yearly_chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: data.yearly.labels,
                    datasets: [{
                        backgroundColor: COLORS,
                        hoverBackgroundColor: COLORS,
                        data: data.yearly.values,
                    }]          
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    legend: {
                        display: false,
                        position: 'top',
                    },
                    title: {
                        display: false,
                    },
                    onClick: yearlyClickHandler,
                }
            });

            yearly_chart.update();
        }
    });
});

function calculatePoint(i, intervalSize, colorRangeInfo) {
    var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
    return (useEndAsStart 
        ? (colorEnd - (i * intervalSize)) 
        : (colorStart + (i * intervalSize)));
}

function interpolateColors(dataLength, colorScale, colorRangeInfo) {
    var { colorStart, colorEnd } = colorRangeInfo;
    var colorRange = colorEnd - colorStart;
    var intervalSize = colorRange / dataLength;
    var i, colorPoint;
    var colorArray = [];
  
    for (i = 0; i < dataLength; i++) {
        colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
        colorArray.push(colorScale(colorPoint));
    }
  
    return colorArray;
}
