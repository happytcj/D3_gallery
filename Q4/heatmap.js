var margin = {top: 20, right: 90, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    z = d3.scale.linear().range(["white", "steelblue"]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var spellorder = ["Charm","Healing Spell","Hex","Counter Spell","Jinx","Curse","Transfiguration","Conjuration"]
var bookorder = ["Sorcerer's Stone","Chamber of Secrets","Prisoner of Azkaban","Goblet of Fire","Order of the Phoenix","Half Blood Prince","Deathly Hallows"]
var dataset1 = []

d3.csv("heatmap.csv", function(rows) {
  rows.forEach(function(d) {
    if (d.House==="Gryffindor") {
      dataset1.push([
        // +d["Sorcerer's Stone"], +d["Chamber of Secrets"], 
        // +d["Prisoner of Azkaban"], +d["Goblet of Fire"], 
        // +d["Order of the Phoenix"], +d["Half Blood Prince"],
        // +d["Deathly Hallows"]
        ])
    }
  });

  var dataset1_max_row = dataset1.map(function(row){ return Math.max.apply(Math, row); });
  var dataset1_max = Math.max.apply(null, dataset1_max_row);

  // Compute the scale domains.
  x.domain(spellorder);
  y.domain(bookorder);
  z.domain([0, dataset1_max]);

  x.domain([x.domain()[0], x.domain()[1]]);
  y.domain([y.domain()[0], y.domain()[1]]);

  // Display the tiles for each non-zero row.
  svg.selectAll(".tile")
      .data(dataset1)
    .enter().append("rect")
      .attr("class", "tile")
      .attr("x", function(d) { return x(d.spell); })
      .attr("y", function(d) { return y(d.book); })
      .attr("width", x(xStep) - x(0))
      .attr("height",  y(0) - y(yStep))
      .style("fill", function(d) { return z(d.count); });

  // Add a legend for the color values.
  var legend = svg.selectAll(".legend")
      .data(z.ticks(6).slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width + 20) + "," + (20 + i * 20) + ")"; });

  legend.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", z);

  legend.append("text")
      .attr("x", 26)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String);

  svg.append("text")
      .attr("class", "label")
      .attr("x", width + 20)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text("Count");

  // Add an x-axis with label.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).ticks(d3.time.days).tickFormat(formatDate).orient("bottom"))
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .attr("text-anchor", "end")
      .text("Date");

  // Add a y-axis with label.
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"))
    .append("text")
      .attr("class", "label")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .text("Value");
});