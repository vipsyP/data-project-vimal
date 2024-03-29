function load() {
    var chart = Highcharts.chart('container', {

        title: {
            text: 'Press a button to plot a chart'
        }

    });
}

// Graph 1 -- get necessary data
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

            drawNoOfMatchesPlayed(items);
        }
    })
}

function drawNoOfMatchesPlayed(items) {
    var chart = Highcharts.chart('container', {

        title: {
            text: 'No. of matches played each year'
        },

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

// Graph 2 -- get necessary data
function plotStackedBarGraph() {
    console.log("starting request to /api/stackedBarGraph");

    $.ajax({
        type: "get",
        url: 'http://localhost:3000/api/stackedBarGraph',
        contentType: 'application/json',
        success: function (itemsOfItems) {

            console.log("Recieved: "+JSON.stringify( itemsOfItems));
            console.log("Recieved: "+JSON.stringify( itemsOfItems.winnerData));
            console.log("Data: "+JSON.stringify( itemsOfItems.winnerData[0].data));

            let years = itemsOfItems.winnerData[0].data.map((year, index)=>{
                return index+2008;
            });
            let series = itemsOfItems.winnerData.map((team, index)=>{
                return({name: team.name, data: team.data});
            });
            console.log(years)
            console.log(series);

            drawStackedBarGraph(years, series)
        }
    });
}

function drawStackedBarGraph(years, series) {
    Highcharts.chart('container', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'No. of matches won by the teams each year'
        },
        xAxis: {
            categories: years
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
        series: series
    });
}

// Graph 3
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

            let teams = Object.keys(items);
            let extra_runs = Object.values(items);

            console.log(teams);
            console.log(extra_runs);

            drawExtraRunsConceded(teams, extra_runs);
        }
    });
}

function drawExtraRunsConceded(teams, extra_runs) {
            var chart = Highcharts.chart('container', {

                title: {
                    text: 'No. of runs conceded by teams in 2016'
                },

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

// Graph 4
function plotTopEconomicalBowlers() {
    console.log("starting request to /api/topEconomicalBowlers");

    $.ajax({
        type: "get",
        url: 'http://localhost:3000/api/topEconomicalBowlers',
        contentType: 'application/json',
        success: function (items) {

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

            drawTopEconomicalBowlers(bowlers, economy);
        }
    });
}


function drawTopEconomicalBowlers() {

    var chart = Highcharts.chart('container', {

        title: {
            text: 'Top ten economical bowlers'
        },

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

// Graph 5
function plotStory() {

    console.log("you clicked plot story");
    $.ajax({
        type: "get",
        url: 'http://localhost:3000/api/mostPopularVenues',
        contentType: 'application/json',
        success: function (items) {

            console.log("success");
            console.log("These are the items: "+JSON.stringify(items));
            //console.log(items[0]._id);
            //console.log(items[0].matchesPlayed);

            let totalMatches = 0;
            items.forEach(element => {
                totalMatches += element.matchesPlayed;
            });
            console.log("Total matches: " + totalMatches);
            let otherMatches = 636 - totalMatches;
            console.log("Total matches: " + otherMatches);

            let seriesArray = [];
            let seriesObj;
            items.forEach(element => {
                seriesObj = {name: element._id, y: element.matchesPlayed};
                seriesArray.push(seriesObj);
            });
            seriesObj = {name: "Other", y: otherMatches, sliced: true, selected: true};
            seriesArray.push(seriesObj);
            console.log("The series array is: "+JSON.stringify(seriesArray));

            drawStory(seriesArray)
        }
    });
}

function drawStory (seriesArray) {

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
            data: seriesArray
        }]
    });
}