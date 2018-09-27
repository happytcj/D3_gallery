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

var color_blues = ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"]

color = d3.scale.quantile();
color.domain([0, 90]).range(color_blues);

// console.log(d3.extent(education, function(d) { return d.percent_educated; }))

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

// Legend **********************************************************************************
  // g.selectAll("rect")
//     .data(color.range().map(function(d) {
//         d = color.invertExtent(d);
//         if (d[0] == null) d[0] = x.domain()[0];
//         if (d[1] == null) d[1] = x.domain()[1];
//         return d;
//       })).enter().append("rect")
//     .attr("height", 8)
//     .attr("x", function(d) { return x(d[0]); })
//     .attr("width", function(d) { return x(d[1]) - x(d[0]); })
//     .attr("fill", function(d) { return color(d[0]); });

// g.append("text")
//     .attr("class", "caption")
//     .attr("x", x.range()[0])
//     .attr("y", -6)
//     .attr("fill", "#000")
//     .attr("text-anchor", "start")
//     .attr("font-weight", "bold")
//     .text("Education Statistics");
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