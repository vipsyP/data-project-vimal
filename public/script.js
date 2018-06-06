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
                yAxis: {
                    title: {
                        text: 'No. of matches'
                    }
                },
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
                    text: 'No. of matches won by the teams each year'
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
                        text: 'No. of wins'
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

function plotExtraRunsConceded() {
    console.log("starting request to /api/extraRunsConceded");

    $.ajax({
        type: "get",
        url: 'http://localhost:3000/api/extraRunsConceded',
        contentType: 'application/json',
        success: function (items) {

            console.log("count extra runs conceded per team in 2016: ", items);


            if (items == null) {
                return false;
            }

            teams = [];
            extra_runs = [];

            for (item of items) {
                //console.log("item._id: ", item._id);
                teams.push(item._id);
                //console.log("item.total: ", item.total);
                extra_runs.push(item.total);
            }
            // for (team of teams) {
            //     console.log("team: ", team);
            // }
            // for (extra_runs_item of extra_runs) {
            //     console.log("extra runs: ", extra_runs_item);
            // }



            var chart = Highcharts.chart('container', {

                title: {
                    text: 'No. of runs conceded by teams in 2016'
                },

                // subtitle: {
                //     text: 'Plain'
                // },
                yAxis: {
                    title: {
                        text: 'No. of runs conceded'
                    }
                },
                xAxis: {
                    categories: teams
                },

                series: [{
                    type: 'column',
                    colorByPoint: true,
                    data: extra_runs,
                    showInLegend: false
                }]

            });
        }
    });

}

function plotTopEconomicalBowlers() {
    console.log("starting request to /api/topEconomicalBowlers");

    $.ajax({
        type: "get",
        url: 'http://localhost:3000/api/topEconomicalBowlers',
        contentType: 'application/json',
        success: function (items) {
            //items = JSON.parse(items);


            console.log("dur dur: " + JSON.stringify(items));
            console.log("top ten economical bowlers: ", items);
            console.log("typeof items: ", typeof items);

            if (items == null) {
                return false;
            }

            bowlers = [];
            economy = [];

            for (item of items) {
                console.log("item._id: ", item._id);
                bowlers.push(item._id);
                console.log("item.econ: ", item.econ);
                economy.push(item.econ);
            }
            for (bowler of bowlers) {
                console.log("bowler: ", bowler);
            }
            for (economy_item of economy) {
                console.log("economy item: ", economy_item);
            }



            var chart = Highcharts.chart('container', {

                title: {
                    text: 'Top ten economical bowlers'
                },

                // subtitle: {
                //     text: 'Plain'
                // },

                yAxis: {
                    title: {
                        text: 'runs (excluding bye & legbye runs) per over (excluding wide & no balls)'
                    }
                },
                xAxis: {
                    categories: bowlers
                },

                series: [{
                    type: 'column',
                    colorByPoint: true,
                    data: economy,
                    showInLegend: false
                }]

            });
        }
    });


}

function plotStory() {

    console.log("you clicked plot story");
    $.ajax({
        type: "get",
        url: 'http://localhost:3000/api/mostPopularVenues',
        contentType: 'application/json',
        success: function (items) {

            console.log("success");
            console.log(items);
            console.log(items[0]._id);
            console.log(items[0].matchesPlayed);

            let totalMatches = 0;
            items.forEach(element => {
                totalMatches += element.matchesPlayed;
            });
            console.log("Total matches: " + totalMatches);
            let otherMatches = 636 - totalMatches;
            console.log("Total matches: " + otherMatches);

            Highcharts.chart('container', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Percent of matches played at venues'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: [{
                            name: items[0]._id,
                            y: items[0].matchesPlayed
                        },
                        {
                            name: items[1]._id,
                            y: items[1].matchesPlayed
                        },
                        {
                            name: items[2]._id,
                            y: items[2].matchesPlayed
                        },
                        {
                            name: items[3]._id,
                            y: items[3].matchesPlayed
                        },
                        {
                            name: items[4]._id,
                            y: items[4].matchesPlayed
                        },
                        {
                            name: items[5]._id,
                            y: items[5].matchesPlayed
                        },
                        {
                            name: items[6]._id,
                            y: items[6].matchesPlayed
                        },
                        {
                            name: items[7]._id,
                            y: items[7].matchesPlayed
                        },
                        {
                            name: items[8]._id,
                            y: items[8].matchesPlayed
                        },
                        {
                            name: "Other",
                            y: otherMatches,

                            sliced: true,
                            selected: true
                        }
                    ]
                }]
            });

        }
    });
}