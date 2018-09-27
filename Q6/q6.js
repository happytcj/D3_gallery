var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var education = d3.map();

var path = d3.geo.path();

var x = d3.scale.linear()
    .domain([1, 10])
    .rangeRound([600, 860]);

d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "education.csv", function(d) { education.set(d.id, +d.percent_educated); })
    .await(draw_choropleth);

// var color_blues = ["#efedf5","#dadaeb","#bcbddc", "#9e9ac8","#8c96c6","#807dba","#6a51a3","#54278f","#3f007d", "#4d004b"]
var color_blues = ['#e6e6fa','#dcceec','#d2b9de','#c7a1d0','#bc8bc3','#b174b5','#a55ea7','#99479a','#8d2c8d','#800080']
var steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
color = d3.scale.quantile();
color.domain(steps).range(color_blues);

// console.log(d3.extent(education, function(d) { return d.percent_educated; }))

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

// Legend **********************************************************************************
var legend = svg.selectAll(".legend")
    .data([0].concat(color.quantiles()), function(d) { return d; });

legend.enter().append("g")
    .attr("class", "legend");

var gridSize = 50

legend.append("rect")
  .attr("x", width-100)
  .attr("y", function(d, i) { return 25+gridSize * i; })
  .attr("width", gridSize/2)
  .attr("height", gridSize)
  .style("fill", function(d, i) { return color_blues[i]; })
  .attr("stroke-width", 1).attr("stroke", "black");

legend.append("text")
  .attr("class", "mono")
  .text(function(d,i) { 
    console.log(steps[i]);
    return (steps[i]) + "%"; 
  })
  .attr("x", width-70)
  .attr("y", function(d, i) { return 50+gridSize * i; });

// Title
g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .attr("font-size", 20)
    .text("Education Statistics");
// End Legend *******************************************************************************

function draw_choropleth(error, us) {
  if (error) {
    throw error;
  }

  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path").attr("stroke-width", 0.25).attr("stroke", "black")
    .attr("fill", function(d) { return color(d.percent_educated = education.get(d.id)); })
    .attr("d", path)
    .append("title")
    .text(function(d) { return d.percent_educated + "%"; });
}