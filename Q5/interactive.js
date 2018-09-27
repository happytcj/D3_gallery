var data=[{city: 'San Antonio', population_2012: 1383505, growth: {year_2013:25405, year_2014:26644 , year_2015:28593 , year_2016:23591 , year_2017:24208}},
{city: 'New York', population_2012: 8383504, growth: {year_2013:75138 , year_2014:62493 , year_2015:61324 , year_2016:32967 , year_2017:7272}},
{city: 'Chicago', population_2012: 2717989, growth: {year_2013:6493 , year_2014:2051 , year_2015:-1379 , year_2016:-4879 , year_2017:-3825}},
{city: 'Los Angeles', population_2012: 3859267, growth:{year_2013:32516 , year_2014:30885 , year_2015:30791 , year_2016:27657 , year_2017:18643}},
{city: 'Phoenix', population_2012: 1495880, growth: {year_2013:25302 , year_2014:26547 , year_2015:27310 , year_2016:27003 , year_2017:24036}}
];

function compare(a,b) {
  if (a.population_2012 < b.population_2012) {
    return -1;
  }
  else if (a.population_2012 > b.population_2012) {
    return 1;
  }
  return 0;
}
data = data.sort(compare);

var margin = {
    top: 15,
    right: 25,
    bottom: 15,
    left: 80
};

var width = 720 - margin.left - margin.right,
    height = 375 - margin.top - margin.bottom;

var svg = d3.select("#barchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.linear()
    .range([0, width])
    .domain([0, d3.max(data, function (d) {
        return d.population_2012;
    })]);

var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .1)
    .domain(data.map(function (d) {
        return d.city;
    }));

var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(0)
    .orient("left");

var gy = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

var bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("g")

var dataset1;
var svg_mini;

function showLineChart(city, growth, pop2012) {
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 336 - margin.left - margin.right,
        height = 175 - margin.top - margin.bottom;

    // This is terrible but I'm in a rush
    dataset1 = [];
    var numYears = 5; 
    for (var i = 0; i < numYears; i++) {
        var obs = {}; 
        obs.year = 2013+i
        if (i === 0) {
            obs.pct_change = 100.0*(growth.year_2013)/pop2012
        } else if (i === 1) {
            obs.pct_change = 100.0*(growth.year_2014)/(pop2012+growth.year_2013)
        } else if (i === 2) {
            obs.pct_change = 100.0*(growth.year_2015)/(pop2012+growth.year_2013+growth.year_2014)
        } else if (i === 3) {
            obs.pct_change = 100.0*(growth.year_2016)/(pop2012+growth.year_2013+growth.year_2014+growth.year_2015)
        } else if (i === 4) {
            obs.pct_change = 100.0*(growth.year_2017)/(pop2012+growth.year_2013+growth.year_2014+growth.year_2015+growth.year_2016)
        } 
        dataset1.push(obs)
    }
    // console.log(dataset1);

    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5).tickFormat(d3.format("d"));

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(10);
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.pct_change); });
        
    // Adds the svg canvas
    svg_mini = d3.select("#linechart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" +margin.left + "," +margin.top + ")");
            // .attr("transform", "translate( 100, 100)");

    x.domain(d3.extent(dataset1, function(d) { return d.year; }));
    // y.domain(d3.extent(dataset1, function(d) { return d.pct_change; }));
    y.domain([-0.2, 2.0]);

    // Add the valueline path.
    svg_mini.append("path")
        .attr("class", "line")
        .attr("d", valueline(dataset1));

    // Add the X Axis
    svg_mini.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg_mini.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    return svg_mini
};

bars.append("rect")
    .attr("class", "bar")
    .attr("y", function (d) {
        return y(d.city);
    })
    .attr("height", y.rangeBand())
    .attr("x", 0)
    .attr("fill", "gray")
    .attr("width", function (d) {
        return x(d.population_2012+d.growth.year_2013+d.growth.year_2014+d.growth.year_2015+d.growth.year_2016+d.growth.year_2017);
    })
    .on("mouseover", function(d) {
        d3.select(this).attr("fill", "red");
        svg_mini = showLineChart(d.city, d.growth, d.population_2012)
    })
    .on("mouseout", function(d) {
        d3.select(this).attr("fill", "gray");
        svg_mini.selectAll("*").remove()
    });

//add a value label to the right of each bar
bars.append("text")
    .attr("class", "white-label")
    //y position of the label is halfway down the bar
    .attr("y", function (d) {
        return y(d.city) + y.rangeBand() / 2 + 4;
    })
    //x position is 3 pixels to the right of the bar
    .attr("x", function (d) {
        return 5;
    })
    .text(function (d) {
        return d.population_2012+d.growth.year_2013+d.growth.year_2014+d.growth.year_2015+d.growth.year_2016+d.growth.year_2017;
    });