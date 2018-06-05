function load() {
    var chart = Highcharts.chart('container', {

        title: {
            text: 'Press a button to plot a chart'
        }

    });
}


function plotNoOfMatchesPlayed() {
    console.log("starting request to /api/numberOfMatches");
    $.ajax({
        type: "get",
        url: 'http://localhost:3000/api/numberOfMatches',
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

function plotStackedBarGraph() {
    console.log("starting request to /api/stackedBarGraph");

    //find unique years
    // let years = new Set();

    // $.ajax({
    //     type: "get",
    //     url: 'http://localhost:3000/api/stackedBarGraph',
    //     contentType: 'application/json',
    //     success: function (items) {

    //     }
    // }); 


    $.ajax({
        type: "get",
        url: 'http://localhost:3000/api/stackedBarGraph',
        contentType: 'application/json',
        success: function (itemsOfItems) {

            // retain only the count values
            let arrayOfArrays = [];
            let arrays = [];

            for (items of itemsOfItems) {
                arrays = [];
                for (item of items) {
                    arrays.push(item.count);
                }
                arrayOfArrays.push(arrays);
            }
            console.log(arrayOfArrays);
            itemsOfItems = arrayOfArrays;

            console.log("count of matches won by each team over the years array: ", itemsOfItems);

            Highcharts.chart('container', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Stacked bar chart'
                },
                xAxis: {
                    categories: ["Chennai Super Kings",
                        "Deccan Chargers",
                        "Delhi Daredevils",
                        "Gujarat Lions",
                        "Kings XI Punjab",
                        "Kochi Tuskers Kerala",
                        "Kolkata Knight Riders",
                        "Mumbai Indians",
                        "Pune Warriors",
                        "Rajasthan Royals",
                        "Rising Pune Supergiant",
                        "Rising Pune Supergiants",
                        "Royal Challengers Bangalore",
                        "Sunrisers Hyderabad"
                    ]
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'number of matches won'
                    }
                },
                legend: {
                    reversed: true
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                series: [{
                        name: '2008',
                        data: itemsOfItems[0]
                    }, {
                        name: '2009',
                        data: itemsOfItems[1]
                    }, {
                        name: '2010',
                        data: itemsOfItems[2]
                    },
                    {
                        name: '2011',
                        data: itemsOfItems[3]
                    },
                    {
                        name: '2012',
                        data: itemsOfItems[4]
                    },
                    {
                        name: '2013',
                        data: itemsOfItems[5]
                    },
                    {
                        name: '2014',
                        data: itemsOfItems[6]
                    },
                    {
                        name: '2015',
                        data: itemsOfItems[7]
                    },
                    {
                        name: '2016',
                        data: itemsOfItems[8]
                    },
                    {
                        name: '2017',
                        data: itemsOfItems[9]
                    }
                ]
            });
        }
    });
}

function plotExtraRunsConceded() {}

function plotTopEconomicalBowlers() {}

function plotStory() {}