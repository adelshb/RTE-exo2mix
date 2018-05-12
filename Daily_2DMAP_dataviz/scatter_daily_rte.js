// set the stage
var margin = {t:30, r:20, b:20, l:40 },
	w = 1200 - margin.l - margin.r,
	h = 700 - margin.t - margin.b,
	x = d3.scale.linear().range([0, w]),
	y = d3.scale.linear().range([h - 60, 0]),
	//colors that will reflect geographical regions
	color = d3.scale.category10();

var svg = d3.select("#chart").append("svg")
	.attr("width", w + margin.l + margin.r)
	.attr("height", h + margin.t + margin.b);

// set axes, as well as details on their ticks
var xAxis = d3.svg.axis()
	.scale(x)
	.ticks(10)
	.tickSubdivide(true)
	.tickSize(6, 3, 0)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.ticks(10)
	.tickSubdivide(true)
	.tickSize(6, 3, 0)
	.orient("left");

// group that will contain all of the plots
var groups = svg.append("g").attr("transform", "translate(" + margin.l + "," + margin.t + ")");

// array of the regions, used for the legend
var season = ['Winter' , 'Spring' , 'Summer' , 'Autumn']

// bring in the data, and do everything that is data-driven
d3.csv("PCA2017.csv", function(data) {

// sort data alphabetically by region, so that the colors match with legend
data.sort(function(a, b) { return d3.ascending(a.season, b.season); })
console.log(data)

var x0 = Math.max(-d3.min(data, function(d) { return d.date; }), d3.max(data, function(d) { return d.date; }));
x.domain([-15000, 20000]);
y.domain([-15000, 15000])

// style the circles, set their locations based on data
var circles =
groups.selectAll("circle")
	.data(data)
  .enter().append("circle")
  .attr("class", "circles")
  .attr({
    cx: function(d) { return x(+d.X0); },
    cy: function(d) { return y(+d.X1); },
    r: function(d) { return 5; },
    id: function(d) { return d.Date; },
  })
	.style("fill", function(d) { return color(d.Season); });


// what to do when we mouse over a bubble
var mouseOn = function() { 
	var circle = d3.select(this);

// transition to increase size/opacity of bubble
	circle.transition()
	.duration(800).style("opacity", 2)
	.attr("r", 16).ease("elastic");

// function to move mouseover item to front of SVG stage, in case
// another bubble overlaps it
	d3.selection.prototype.moveToFront = function() { 
	  return this.each(function() { 
		this.parentNode.appendChild(this); 
	  }); 
	};

// skip this functionality for IE9, which doesn't like it
	if (!$.browser.msie) {
		circle.moveToFront();	
		}
};
// what happens when we leave a bubble?
var mouseOff = function() {
	var circle = d3.select(this);

	// go back to original size and opacity
	circle.transition()
	.duration(800).style("opacity", .5)
	.attr("r", 5).ease("elastic");
};

// run the mouseon/out functions
circles.on("mouseover", mouseOn);
circles.on("mouseout", mouseOff);

// tooltips (using jQuery plugin tipsy)
circles.append("title")
	.text(function(d) { return d.Date ;})

$(".circles").tipsy({ 
	gravity: 'w',
	html: 'True',
});

// the legend color guide
var legend = svg.selectAll("rect")
		.data(season)
	.enter().append("rect")
	.attr({
	  x: function(d, i) { return (40 + i*80); },
	  y: h,
	  width: 25,
	  height: 12
	})
	.style("fill", function(d) { return color(d); });
/*	.on("click", function(d) {d3.selectAll(".circle").style("opacity",1)
		if (clicked !== d){
     d3.selectAll(".symbol")
       .filter(function(e){
       return e.genre !== d;
     })
       .style("opacity",0.1)
     clicked = d
   }
    else{
      clicked = ""
    }
  });*/


// legend labels	
	svg.selectAll("text")
		.data(season)
	.enter().append("text")
	.attr({
	x: function(d, i) { return (40 + i*80); },
	y: h + 24,
	})
	.text(function(d) { return d; });

// what to do when click on legend
	$(".circles").click(function() {
	window.open("https://www.imdb.com/");
	});
});