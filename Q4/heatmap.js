var buckets = 9
var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"] // alternatively colorbrewer.YlGnBu[9]
var margin = {top: 20, right: 90, bottom: 170, left: 50},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 8);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var spellorder = ["Charm","Healing Spell","Hex","Counter Spell","Jinx","Curse","Transfiguration","Conjuration"].sort()
var bookorder = ["Sorcerer's Stone","Chamber of Secrets","Prisoner of Azkaban","Goblet of Fire","Order of the Phoenix",
                  "Half Blood Prince","Deathly Hallows"].reverse()
var dataset1 = []
var x;
var y;
var z;

d3.csv("heatmap.csv", function(rows) {
  rows.forEach(function(d) {
    if (d.House==="Gryffindor") {
      var numBooks = bookorder.length; 
      for (var i = 0; i < numBooks; i++) {
        var obs = {}; 
        obs.book = bookorder[i]
        obs.spell = d.SpellType
        obs.count = +d[bookorder[i]]
        dataset1.push(obs)
      }
    }
  });

  x = d3.scale.ordinal().domain(spellorder).rangePoints([0, width]);
  y = d3.scale.ordinal().domain(bookorder).rangePoints([height, 0]);
  z = d3.scale.quantile();
  z.domain([0, buckets-1, d3.max(dataset1, function(d) { return d.count; })]).range(colors);

  // Display the tiles for each non-zero row.
  svg.selectAll(".tile")
      .data(dataset1)
    .enter().append("rect")
      .attr("class", "tile")
      .attr("x", function(d) { return x(d.spell); })
      .attr("y", function(d) { return y(d.book); })
      .attr("width", gridSize)
      .attr("height",  gridSize)
      .style("fill", function(d) { return z(d.count); });

  // Add a legend for the color values.
  // var legend = svg.selectAll(".legend")
  //     .data(z.ticks(6).slice(1).reverse())
  //   .enter().append("g")
  //     .attr("class", "legend")
  //     .attr("transform", function(d, i) { return "translate(" + (width + 20) + "," + (20 + i * 20) + ")"; });

  // legend.append("rect")
  //     .attr("width", 20)
  //     .attr("height", 20)
  //     .style("fill", z);

  // legend.append("text")
  //     .attr("x", 26)
  //     .attr("y", 10)
  //     .attr("dy", ".35em")
  //     .text(String);

  svg.append("text")
      .attr("class", "label")
      .attr("x", width + 20)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text("Count");

  // Add an x-axis with label.
  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.svg.axis().scale(x).orient("bottom"))
  //   .append("text")
  //     .attr("class", "label")
  //     .attr("x", width)
  //     .attr("y", -6)
  //     .attr("text-anchor", "end")
  //     .text("Date");

  // Add a y-axis with label.
  // svg.append("g")
  //     .attr("class", "y axis")
  //     .call(d3.svg.axis().scale(y).orient("left"))
  //   .append("text")
  //     .attr("class", "label")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .attr("text-anchor", "end")
  //     .attr("transform", "rotate(-90)")
  //     .text("Value");
});