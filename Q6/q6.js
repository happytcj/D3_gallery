var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var education = d3.map();
var details = d3.map();

var path = d3.geo.path();

var x = d3.scale.linear()
    .domain([1, 10])
    .rangeRound([600, 860]);

d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "education.csv", 
      function(d) { 
        var obs = {};
        obs.id = d.id;
        obs.percent_educated = +d.percent_educated;
        obs.name = d.name.replace(/County/g, '');
        education.set(d.id, obs);
      })
    .defer(d3.csv, "education_details.csv", 
      function(d) { 
        var obs = {};
        if (d.id != "") {
          obs.id = d.id;
          obs.pro = +d.qualified_professionals.replace(/,/g, '');
          obs.high = +d.high_school.replace(/,/g, '');
          obs.mid = +d.middle_school_or_lower.replace(/,/g, '');
          details.set(d.id, obs);
        }

      })
    .await(draw_choropleth);

var color_blues = ['#e6e6fa','#dcceec','#d2b9de','#c7a1d0','#bc8bc3','#b174b5','#a55ea7','#99479a','#8d2c8d','#800080']
var steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
color = d3.scale.quantile();
color.domain(steps).range(color_blues);

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
    return (steps[i]) + "%"; 
  })
  .attr("x", width-70)
  .attr("y", function(d, i) { return 50+gridSize * i; });
// End Legend *******************************************************************************

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

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset(function(d) {
    coordinates = d3.mouse(this);
    var x = -10;
    var y = 0
    if (coordinates[1] < 200) {
      x = 100;
    }
    if (coordinates[0] < 300) {
      y = 100
    }
    if (coordinates[0] > 600) {
      y = -100
    }
    return [x, y];
  })
  .html(function(d) {
    var tmp = education.get(d.id); 
    var tmp2 = details.get(d.id); 
    return "County: " + tmp.name + "<br />" + 
        "Percent Educated: " + tmp.percent_educated + "%<br />" +
        "Qualified Professionals: " + tmp2.pro + "%<br />" +
        "High School Graduates: " + tmp2.high + "%<br />" +
        "Middle School or Lower Graduates: " + tmp2.mid;
  });

svg.call(tip);

function draw_choropleth(error, us) {
  if (error) {
    throw error;
  }
// consulted following link for tooltips: http://bl.ocks.org/Caged/6476579
choropleth = svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path").attr("stroke-width", 0.25).attr("stroke", "black")

choropleth.attr("fill", function(d,i) {
  if (education.has(d.id)) {
    return color(education.get(d.id).percent_educated); 
  }
})
    .attr("d", path)
    .append("title");

choropleth
    .on('mouseover', tip.show) 
    .on('mouseout', tip.hide);
}