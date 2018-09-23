
var rows;
var dataset1 = [];
var dataset2 = [];
var dataset3 = [];
var dataset4 = [];

var width = 1200*0.85,
    height = 700*0.85,
    color = d3.scale.category20c();

var padding = 100;

d3.csv("movies.csv", function(loadedRows) {
  rows = loadedRows;
  return performWith(rows);
});

function performWith(rows) {
	var numRows = rows.length;
	for (var i = 0; i < numRows; i++) {
		dataset1.push([parseFloat(rows[i]['imdbRating']), 
					parseFloat(rows[i]['WinsNoms']), 
					rows[i]['IsGoodRating']])

		dataset2.push([parseFloat(rows[i]['imdbRating']), 
					parseFloat(rows[i]['Budget']/1000000), 
					rows[i]['IsGoodRating']])

		dataset3.push([parseFloat(rows[i]['imdbRating']), 
					parseFloat(rows[i]['imdbVotes']/1000), 
					rows[i]['IsGoodRating'], 
					parseFloat(rows[i]['WinsNoms'])])

		dataset4.push([parseFloat(rows[i]['imdbRating']), 
					parseFloat(rows[i]['WinsNoms'])+0.01, 
					rows[i]['IsGoodRating']])
	}

	var xScale = d3.scale.linear()
            .domain([0, 10])
            .range([padding, width-padding]);

	var yScale = d3.scale.linear()
            .domain(
            	// [d3.min(dataset1, function(d) { return d[1]; }), 
            	[0,
            	d3.max(dataset1, function(d) { return d[1]; })
            	]
            	)
            .range([height-padding, padding]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

	var shapes = svg.selectAll(".shapes")
	    .data(dataset1).enter();

	shapes.append("circle")
    .filter(function(d){ return d[2] == "0"; })
	.attr("cx", function(d) {
			return xScale(d[0]);
	})
	.attr("cy", function(d) {
			return yScale(d[1]);
	})
	.attr("r", 5)
	.attr("fill", "rgba(255, 255, 255, 0.25)")
	.attr("stroke", "red");

	var node = svg.selectAll("g.node")
	  .data(dataset1);

	var nodeEnter = node.enter().append("g")
	  .filter(function(d){ return d[2] == "1"; })
	  .attr("class", "node");

	nodeEnter
		.attr("transform", function(d) { 
			  return "translate(" + xScale(d[0])+ "," + yScale(d[1]) + ")"; })
		.append("path")
		.style("fill", "rgba(255, 255, 255, 0.25)")
		.style("stroke", "blue")
		.attr("d", d3.svg.symbol()
		             .size(50)
		             .type("cross"));

	var xAxis = d3.svg.axis()
	  .scale(xScale)
	  .orient("bottom");

	var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(0," + (height - padding) + ")")
	  .call(xAxis);

	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(" + padding + ",0)")
	  .call(yAxis);

	svg.append("text")
	  .attr("class", "x label")
	  .attr("text-anchor", "end")
	  .attr("x", width*0.54)
	  .attr("y", height - 60)
	  .text("IMDb Rating");

	svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", padding/2.5)
	    .attr("x", -width/4)
	    .attr("dy", ".75em")
	    .attr("transform", "rotate(-90)")
	    .text("Wins+Noms");

    svg.append("text")
            .attr("x", (width/2))             
            .attr("y", (padding/1.5))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("Wins+Nominations vs. IMDb Rating");

    shapes.append("circle")
		.attr("cx", width-padding)
		.attr("cy", padding/2.5)
		.attr("r", 5)
		.attr("fill", "rgba(255, 255, 255, 0.25)")
		.attr("stroke", "red");

	var nodeEnter = node.enter().append("g")
	  .attr("class", "node");
	nodeEnter
		.attr("transform", "translate(" + (width-padding) + "," + (padding/1.5) + ")")
		.append("path")
		.style("fill", "rgba(255, 255, 255, 0.25)")
		.style("stroke", "blue")
		.attr("d", d3.svg.symbol()
		             .size(50)
		             .type("cross"));

	svg.append("text")
	        .attr("x", (width-padding+50))             
	        .attr("y", (padding/2.5+5))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .text("Bad Ratings");

	svg.append("text")
	        .attr("x", (width-padding+55))             
	        .attr("y", (padding/1.5+5))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .text("Good Ratings");

// Second plot ******************************************************

	var xScale = d3.scale.linear()
            .domain(
            	// [d3.min(dataset1, function(d) { return d[0]; }), 
            	[0, 10
            	// d3.max(dataset1, function(d) { return d[0]; })
            	]
            	)
            .range([padding, width-padding]);

	var yScale = d3.scale.linear()
            .domain(
            	// [d3.min(dataset1, function(d) { return d[1]; }), 
            	[0,
            	d3.max(dataset2, function(d) { return d[1]; })
            	]
            	)
            .range([height-padding, padding]);
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

	var shapes = svg.selectAll(".shapes")
	    .data(dataset2).enter();

	shapes.append("circle")
    .filter(function(d){ return d[2] == "0"; })
	.attr("cx", function(d) {
			return xScale(d[0]);
	})
	.attr("cy", function(d) {
			return yScale(d[1]);
	})
	.attr("r", 5)
	.attr("fill", "rgba(255, 255, 255, 0.25)")
	.attr("stroke", "red");

	var node = svg.selectAll("g.node")
	  .data(dataset2);

	var nodeEnter = node.enter().append("g")
	  .filter(function(d){ return d[2] == "1"; })
	  .attr("class", "node")
	  .attr("transform", function(d) { 
		  return "translate(" + xScale(d[0])+ "," + yScale(d[1]) + ")"; });

	nodeEnter.append("path")
		.style("fill", "rgba(255, 255, 255, 0.25)")
		.style("stroke", "blue")
		.attr("d", d3.svg.symbol()
		             .size(50)
		             .type("cross"));

	var xAxis = d3.svg.axis()
	  .scale(xScale)
	  .orient("bottom")
	  // .ticks(10)
	  ;

	var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      // .ticks(10)
      ;

	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(0," + (height - padding) + ")")
	  .call(xAxis);

	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(" + padding + ",0)")
	  .call(yAxis);

	svg.append("text")
	  .attr("class", "x label")
	  .attr("text-anchor", "end")
	  .attr("x", width*0.54)
	  .attr("y", height - 60)
	  .text("IMDb Rating");

	svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", padding/2.5)
	    .attr("x", -width/5)
	    .attr("dy", ".75em")
	    .attr("transform", "rotate(-90)")
	    .text("Budget (Millions of Dollars)");

    svg.append("text")
            .attr("x", (width/2))             
            .attr("y", (padding/1.5))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("Budget vs. IMDb Rating");

    shapes.append("circle")
		.attr("cx", width-padding)
		.attr("cy", padding/2.5)
		.attr("r", 5)
		.attr("fill", "rgba(255, 255, 255, 0.25)")
		.attr("stroke", "red");

	var nodeEnter = node.enter().append("g")
	  .attr("class", "node");
	nodeEnter
		.attr("transform", "translate(" + (width-padding) + "," + (padding/1.5) + ")")
		.append("path")
		.style("fill", "rgba(255, 255, 255, 0.25)")
		.style("stroke", "blue")
		.attr("d", d3.svg.symbol()
		             .size(50)
		             .type("cross"));

    svg.append("text")
            .attr("x", (width-padding+50))             
            .attr("y", (padding/2.5+5))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("Bad Ratings");

    svg.append("text")
            .attr("x", (width-padding+55))             
            .attr("y", (padding/1.5+5))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("Good Ratings");

// Third plot ******************************************************

	var xScale = d3.scale.linear()
            .domain([0, 10])
            .range([padding, width-padding]);

	var yScale = d3.scale.linear()
            .domain([0,d3.max(dataset3, function(d) { return d[1]; })])
            .range([height-padding, padding]);

    var rScale = d3.scale.linear()
             .domain(
             	[d3.min(dataset3, function(d) { return d[3]; }), 
             	d3.max(dataset3, function(d) { return d[3]; })]
             	)
             .range([1, 10]);

    var sideScale = d3.scale.linear()
             .domain(
             	[d3.min(dataset3, function(d) { return d[3]; }), 
             	d3.max(dataset3, function(d) { return d[3]; })]
             	)
             .range([10, 100]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

	var shapes = svg.selectAll(".shapes")
	    .data(dataset3).enter();

	shapes.append("circle")
    .filter(function(d){ return d[2] == "0"; })
	.attr("cx", function(d) {
			return xScale(d[0]);
	})
	.attr("cy", function(d) {
			return yScale(d[1]);
	})
	.attr("r", function(d) {
			return rScale(d[3]);
	})
	.attr("fill", "rgba(255, 255, 255, 0.25)")
	.attr("stroke", "red");

	var node = svg.selectAll("g.node")
	  .data(dataset3);

	var nodeEnter = node.enter().append("g")
	  .filter(function(d){ return d[2] == "1"; })
	  .attr("class", "node")
	  .attr("transform", function(d) { 
		  return "translate(" + xScale(d[0])+ "," + yScale(d[1]) + ")"; });

	nodeEnter.append("path")
		.style("fill", "rgba(255, 255, 255, 0.25)")
		.style("stroke", "blue")
		.attr("d", d3.svg.symbol()
		             .size(function(d) {
			return sideScale(d[3]);
	}).type("cross"));

	var xAxis = d3.svg.axis()
	  .scale(xScale)
	  .orient("bottom");

	var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(0," + (height - padding) + ")")
	  .call(xAxis);

	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(" + padding + ",0)")
	  .call(yAxis);

	svg.append("text")
	  .attr("class", "x label")
	  .attr("text-anchor", "end")
	  .attr("x", width*0.54)
	  .attr("y", height - 60)
	  .text("IMDb Rating");

	svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", padding/2.5)
	    .attr("x", -width/4)
	    .attr("dy", ".75em")
	    .attr("transform", "rotate(-90)")
	    .text("IMDb Votes (1000)");

    svg.append("text")
            .attr("x", (width/2))             
            .attr("y", (padding/1.5))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("Votes vs. IMDb Rating sized by Wins+Nominations");

    shapes.append("circle")
		.attr("cx", width-padding)
		.attr("cy", padding/2.5)
		.attr("r", 5)
		.attr("fill", "rgba(255, 255, 255, 0.25)")
		.attr("stroke", "red");

	var nodeEnter = node.enter().append("g")
	  .attr("class", "node");
	nodeEnter
		.attr("transform", "translate(" + (width-padding) + "," + (padding/1.5) + ")")
		.append("path")
		.style("fill", "rgba(255, 255, 255, 0.25)")
		.style("stroke", "blue")
		.attr("d", d3.svg.symbol()
		             .size(50)
		             .type("cross"));
		
    svg.append("text")
            .attr("x", (width-padding+50))             
            .attr("y", (padding/2.5+5))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("Bad Ratings");

    svg.append("text")
            .attr("x", (width-padding+55))             
            .attr("y", (padding/1.5+5))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("Good Ratings");

// Fourth plot ******************************************************

	var xScale = d3.scale.linear()
            .domain([0, 10])
            .range([padding, width-padding]);

	var yScale = d3.scale.sqrt()
            .domain(
            	// [d3.min(dataset1, function(d) { return d[1]; }), 
            	[0,
            	d3.max(dataset1, function(d) { return d[1]; })
            	]
            	)
            .range([height-padding, padding]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

	var shapes = svg.selectAll(".shapes")
	    .data(dataset1).enter();

	shapes.append("circle")
    .filter(function(d){ return d[2] == "0"; })
	.attr("cx", function(d) {
			return xScale(d[0]);
	})
	.attr("cy", function(d) {
			return yScale(d[1]);
	})
	.attr("r", 5)
	.attr("fill", "rgba(255, 255, 255, 0.25)")
	.attr("stroke", "red");

	var node = svg.selectAll("g.node")
	  .data(dataset1);

	var nodeEnter = node.enter().append("g")
	  .filter(function(d){ return d[2] == "1"; })
	  .attr("class", "node");

	nodeEnter
		.attr("transform", function(d) { 
			  return "translate(" + xScale(d[0])+ "," + yScale(d[1]) + ")"; })
		.append("path")
		.style("fill", "rgba(255, 255, 255, 0.25)")
		.style("stroke", "blue")
		.attr("d", d3.svg.symbol()
		             .size(50)
		             .type("cross"));

	var xAxis = d3.svg.axis()
	  .scale(xScale)
	  .orient("bottom");

	var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(0," + (height - padding) + ")")
	  .call(xAxis);

	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(" + padding + ",0)")
	  .call(yAxis);

	svg.append("text")
	  .attr("class", "x label")
	  .attr("text-anchor", "end")
	  .attr("x", width*0.54)
	  .attr("y", height - 60)
	  .text("IMDb Rating");

	svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", padding/2.5)
	    .attr("x", -width/4)
	    .attr("dy", ".75em")
	    .attr("transform", "rotate(-90)")
	    .text("Wins+Noms");

    svg.append("text")
            .attr("x", (width/2))             
            .attr("y", (padding/1.5))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("Wins+Nominations (square-root-scaled) vs. IMDb Rating");

    shapes.append("circle")
		.attr("cx", width-padding)
		.attr("cy", padding/2.5)
		.attr("r", 5)
		.attr("fill", "rgba(255, 255, 255, 0.25)")
		.attr("stroke", "red");

	var nodeEnter = node.enter().append("g")
	  .attr("class", "node");
	nodeEnter
		.attr("transform", "translate(" + (width-padding) + "," + (padding/1.5) + ")")
		.append("path")
		.style("fill", "rgba(255, 255, 255, 0.25)")
		.style("stroke", "blue")
		.attr("d", d3.svg.symbol()
		             .size(50)
		             .type("cross"));

	svg.append("text")
	        .attr("x", (width-padding+50))             
	        .attr("y", (padding/2.5+5))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .text("Bad Ratings");

	svg.append("text")
	        .attr("x", (width-padding+55))             
	        .attr("y", (padding/1.5+5))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .text("Good Ratings");

// Fifth plot ******************************************************

	var xScale = d3.scale.linear()
            .domain([0, 10])
            .range([padding, width-padding]);

	var yScale = d3.scale.log()
            .domain(
            	// [d3.min(dataset1, function(d) { return d[1]; }), 
            	[1,
            	d3.max(dataset4, function(d) { return d[1]+0.1; })
            	]
            	)
            .range([height-padding, padding]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

	var shapes = svg.selectAll(".shapes")
	    .data(dataset4).enter();

	shapes.append("circle")
    .filter(function(d){ return d[2] == "0"; })
	.attr("cx", function(d) {
			return xScale(d[0]);
	})
	.attr("cy", function(d) {
			return yScale(d[1]+0.1);
	})
	.attr("r", 5)
	.attr("fill", "rgba(255, 255, 255, 0.25)")
	.attr("stroke", "red");

	var node = svg.selectAll("g.node")
	  .data(dataset4);

	var nodeEnter = node.enter().append("g")
	  .filter(function(d){ return d[2] == "1"; })
	  .attr("class", "node");

	nodeEnter
		.attr("transform", function(d) { 
			  return "translate(" + xScale(d[0])+ "," + yScale(d[1]) + ")"; })
		.append("path")
		.style("fill", "rgba(255, 255, 255, 0.25)")
		.style("stroke", "blue")
		.attr("d", d3.svg.symbol()
		             .size(50)
		             .type("cross"));

	var xAxis = d3.svg.axis()
	  .scale(xScale)
	  .orient("bottom");

	var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(0," + (height - padding) + ")")
	  .call(xAxis);

	svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(" + padding + ",0)")
	  .call(yAxis);

	svg.append("text")
	  .attr("class", "x label")
	  .attr("text-anchor", "end")
	  .attr("x", width*0.54)
	  .attr("y", height - 60)
	  .text("IMDb Rating");

	svg.append("text")
	    .attr("class", "y label")
	    .attr("text-anchor", "end")
	    .attr("y", padding/2.5)
	    .attr("x", -width/4)
	    .attr("dy", ".75em")
	    .attr("transform", "rotate(-90)")
	    .text("Wins+Noms");

    svg.append("text")
            .attr("x", (width/2))             
            .attr("y", (padding/1.5))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("Wins+Nominations (log-scaled) vs. IMDb Rating");

    shapes.append("circle")
		.attr("cx", width-padding)
		.attr("cy", padding/2.5)
		.attr("r", 5)
		.attr("fill", "rgba(255, 255, 255, 0.25)")
		.attr("stroke", "red");

	var nodeEnter = node.enter().append("g")
	  .attr("class", "node");
	nodeEnter
		.attr("transform", "translate(" + (width-padding) + "," + (padding/1.5) + ")")
		.append("path")
		.style("fill", "rgba(255, 255, 255, 0.25)")
		.style("stroke", "blue")
		.attr("d", d3.svg.symbol()
		             .size(50)
		             .type("cross"));

	svg.append("text")
	        .attr("x", (width-padding+50))             
	        .attr("y", (padding/2.5+5))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .text("Bad Ratings");

	svg.append("text")
	        .attr("x", (width-padding+55))             
	        .attr("y", (padding/1.5+5))
	        .attr("text-anchor", "middle")  
	        .style("font-size", "16px") 
	        .text("Good Ratings");

}
