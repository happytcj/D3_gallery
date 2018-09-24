var buckets = 9
var margin = {top: 120, right: 90, bottom: 170, left: 150},
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
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

  // Discrete color array acquired from https://bl.ocks.org/mbostock/5577023
  var colors = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"].reverse()
  z = d3.scale.quantile();
  z.domain([0, buckets-1, d3.max(dataset1, function(d) { return d.count; })]).range(colors);

  var bookLabels = svg.selectAll(".bookLabel")
      .data(bookorder)
      .enter().append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return i * gridSize * 1.2; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.8 + ")");

  var spellLabels = svg.selectAll(".spellLabel")
      .data(spellorder)
      .enter().append("text")
        .text(function(d) {return d;})
        .attr("x", 0)
        .attr("y", function(d, i) {
            return (i * gridSize);
        })
        .style("text-anchor", "left")
        .attr("transform", function(d, i) {
          return "translate(" + (gridSize+16*i) / 2 + ", -6) rotate(-90) rotate(45, 0, " + (i * gridSize) + ")";
      });

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
});