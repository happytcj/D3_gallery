var colorSteps = 9
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
var bookorder_reverse = ["Sorcerer's Stone","Chamber of Secrets","Prisoner of Azkaban","Goblet of Fire","Order of the Phoenix",
                  "Half Blood Prince","Deathly Hallows"]
// Discrete color array acquired from https://bl.ocks.org/mbostock/5577023
var colors = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"].reverse()
var colors_reversed = colors.reverse()

function updateHeatmap(selected_house) {
  var dataset1 = []
  var x;
  var y;
  var z;
  svg.selectAll("*").remove();
  d3.csv("heatmap.csv", function(rows) {
    rows.forEach(function(d) {
      if (d.House===selected_house) {
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
    z.domain([
      d3.min(dataset1, function(d) { return d.count; }),
      colorSteps, 
      d3.max(dataset1, function(d) { return d.count; })]).range(colors);

    var bookLabels = svg.selectAll(".bookLabel")
        .data(bookorder_reverse)
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

    svg.append("text")
         .attr("class", "label")
         .attr("x", -width/2)
         .attr("y", -120)
         .attr("dy", ".35em")
         .attr("transform", "rotate(-90)")
         .text("Book");

    svg.append("text")
         .attr("class", "label")
         .attr("x", width/2)
         .attr("y", -70)
         .attr("dy", ".35em")
         .text("Spell Type");

    svg.append("text")
         .style("font", "18px sans-serif")
         .attr("x", width/2-130)
         .attr("y", -100)
         .attr("dy", ".35em")
         .text("Visualizing Wizarding Houses & Spells");

    var legend = svg.selectAll(".legend")
        .data([0].concat(z.quantiles()), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return gridSize * i; })
      .attr("y", height + 100)
      .attr("width", gridSize)
      .attr("height", gridSize / 2)
      .style("fill", function(d, i) { return colors_reversed[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return gridSize * i; })
      .attr("y", height + gridSize + 80);

    svg.append("text")
         .attr("class", "label")
         .attr("x", width-10)
         .attr("y", height+90)
         .attr("dy", ".35em")
         .text("# of Spells");

    // legend.exit().remove();
  });
};

d3.select('#dropdown')
    .on("change", function () {
      var sect = document.getElementById("dropdown");
      var selected_house = sect.options[sect.selectedIndex].value;

      updateHeatmap(selected_house);
    });
var sect = document.getElementById("dropdown");
var selected_house = sect.options[sect.selectedIndex].value;
updateHeatmap(selected_house);
// sect.options[sect.selectedIndex].value="Slytherin"
