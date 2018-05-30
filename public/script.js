var chart = Highcharts.chart('container', {

    title: {
        text: 'Loading...'
    },

    // subtitle: {
    //     text: 'Plain'
    // },

    xAxis: {
        categories: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017']
    },

    series: [{
        type: 'column',
        colorByPoint: true,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        showInLegend: false
    }]

});


function load() {

    console.log("starting retrieve request");
    $.ajax({
        type: "get",
        url: 'http://localhost:3000/api/retrieve',
        contentType: 'application/json',
        success: function (items) {
            if (items == null) {
                return false;
            }
            console.log("count of matches array: ", items);


            var chart = Highcharts.chart('container', {

                title: {
                    text: 'No. of matches played each year'
                },

                // subtitle: {
                //     text: 'Plain'
                // },

                xAxis: {
                    categories: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017']
                },

                series: [{
                    type: 'column',
                    colorByPoint: true,
                    data: items,
                    showInLegend: false
                }]

            });
        }
    })

}