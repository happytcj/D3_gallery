var data=[{city: 'San Antonio', population_2012: 1383505, growth: {year_2013:25405, year_2014:26644 , year_2015:28593 , year_2016:23591 , year_2017:24208}},
{city: 'New York', population_2012: 8383504, growth: {year_2013:75138 , year_2014:62493 , year_2015:61324 , year_2016:32967 , year_2017:7272}},
{city: 'Chicago', population_2012: 2717989, growth: {year_2013:6493 , year_2014:2051 , year_2015:-1379 , year_2016:-4879 , year_2017:-3825}},
{city: 'Los Angeles', population_2012: 3859267, growth:{year_2013:32516 , year_2014:30885 , year_2015:30791 , year_2016:27657 , year_2017:18643}},
{city: 'Phoenix', population_2012: 1495880, growth: {year_2013:25302 , year_2014:26547 , year_2015:27310 , year_2016:27003 , year_2017:24036}}
];

//sort bars based on value
data = data.sort(function (a, b, c,) {
    return d3.ascending(a.value, b.value);
})

//set up svg using margin conventions - we'll need plenty of room on the left for labels
var margin = {
    top: 15,
    right: 25,
    bottom: 15,
    left: 60
};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#graphic").append("svg")
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

//make y axis to show bar names
var yAxis = d3.svg.axis()
    .scale(y)
    //no tick marks
    .tickSize(0)
    .orient("left");

var gy = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

var bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("g")

//append rects
bars.append("rect")
    .attr("class", "bar")
    .attr("y", function (d) {
        return y(d.city);
    })
    .attr("height", y.rangeBand())
    .attr("x", 0)
    .attr("width", function (d) {
        return x(d.population_2012);
    });

//add a value label to the right of each bar
bars.append("text")
    .attr("class", "label")
    //y position of the label is halfway down the bar
    .attr("y", function (d) {
        return y(d.city) + y.rangeBand() / 2 + 4;
    })
    //x position is 3 pixels to the right of the bar
    .attr("x", function (d) {
        return x(d.population_2012) + 3;
    })
    .text(function (d) {
        return d.population_2012;
    });