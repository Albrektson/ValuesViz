var div = document.getElementById('cnv');
var width = div.clientWidth;
var height = (width/4)*3;
var maxBubbleSize = 25,
    minBubbleSize = 5;
var populateDropdowns = true;

var margin = {top: 20, right: 20, bottom: 80, left: 60},
    graphWidth = width - margin.left - margin.right,
    graphHeight = height - margin.top - margin.bottom;

//create svg canvas
var svg = d3.select("body").select(".leftcolumn").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("id", "canvas");

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("id", "graph");

var xScale = d3.scaleLinear()
  .range([0, graphWidth])
var yScale = d3.scaleLinear()
  .range([graphHeight, 0])
var zScale = d3.scaleLinear()
  .range([minBubbleSize, maxBubbleSize])

var yAxisCall = d3.axisLeft(yScale)
var yAxis = d3.select("#canvas").append("g")
  .attr("class", "y-axis")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(yAxisCall)

var xAxisCall = d3.axisBottom(xScale)
var xAxis = d3.select("#canvas").append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
  .call(xAxisCall)

//axis labels
d3.select("#canvas").append("text")
  .attr("id", "x-axis-title")
  .attr("class", "axis-title")
  .attr("text-anchor", "middle")
  .attr("transform", "translate(" + (graphWidth/2 + margin.left) + "," + (height-40) +")")
  .text("X AXIS")
d3.select("#canvas").append("text")
  .attr("id", "y-axis-title")
  .attr("class", "axis-title")
  .attr("text-anchor", "middle")
  .attr("transform", "translate(" + 20 + "," + (graphHeight/2 + margin.top) +"), rotate(-90)")
  .text("Y AXIS")

var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

update(xData = "A170", yData = "A173", zData = "E035", wave = 6)

function update(xData, yData, zData, wave) {
  var t = d3.transition().duration(750)

  Promise.all([
    d3.csv("stats.csv"),
    d3.csv("reference.csv")
  ]).then(function(data){
    var stats = data[0]
    var ref = data[1]
    var bubbles = d3.select("#graph")
      .selectAll("circle")
        .data(stats, function(d){
          return xData + d[xData];
        });

      if (populateDropdowns) {
        populateDropdowns = false;
        ref.forEach(function(d){
          d3.select("#xOpts")
        	 .append('option')
            .attr("value", "'" + d.Variable + "'")
      	    .text(d.Label)
          d3.select("#yOpts")
        	 .append('option')
            .attr("value", "'" + d.Variable + "'")
      	    .text(d.Label)
          d3.select("#zOpts")
        	 .append('option')
            .attr("value", "'" + d.Variable + "'")
      	    .text(d.Label)
          })
        }

    xScale.domain(d3.extent(stats, function (d) {
      if (d["Wave"] == wave) {
        return +d[xData]
      }
    }))
    .nice();
    yScale.domain(d3.extent(stats, function(d) {
      if (d["Wave"] == wave) {
          return +d[yData]
      }
    }))
    .nice();
    zScale.domain(d3.extent(stats, function(d){
      if (d["Wave"] == wave) {
        return +d[zData]
      }
    }))

    //update axis labels
    var label
    ref.forEach(function(d){
      if (d["Variable"] == yData) { label = d["Label"] }
    })
    d3.select("#y-axis-title")
      .text(label)
    ref.forEach(function(d){
      if (d["Variable"] == xData) { label = d["Label"] }
    })
    d3.select("#x-axis-title")
      .text(label)

    //bubble label prep
    var bubbleLabel
    ref.forEach(function(d){
      if (d["Variable"] == zData) {
        bubbleLabel = d.Label
      }
    })

    //update values
    bubbles
    .transition(t)
    .attr("cx", function(d, i){
      return xScale(+d[xData]);
    })
    .attr("cy", function(d, i) {
      return yScale(+d[yData]);
    })
    .attr("r", function(d){
      if (+d["Wave"] != wave || d[xData] == "NA" || d[yData] == "NA") {
          return 0;
      } else {
        return zScale(+d[zData]);
      }
    })
    .on("mouseover", function(d) {
      tooltip.transition()
          .duration(200)
          .style("opacity", .9);
      tooltip.html(d.Country + "<br/>" + bubbleLabel + ":" + d[zData])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })

    bubbles.enter().append("circle")
      .attr("cx", function(d, i){
        return xScale(+d[xData]);
      })
      .attr("cy", function(d, i) {
        return yScale(+d[yData]);
      })
      .attr("r", function(d){
        if (+d["Wave"] != wave || d[xData] == "NA" || d[yData] == "NA") {
            return 0;
        } else {
          return zScale(+d[zData]);
        }
      })
      .attr("fill", "grey")
      .attr("stroke", "steelblue")
      .attr("stroke-width", "2px")
      .attr("opacity", 0.75)
      .attr("id", function(d){
        return d["Country"]+d["Wave"]
      })
      .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.Country + "<br/>" + bubbleLabel + ":" + d[zData])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    bubbles.exit().remove()

    //update and scale axes
    xAxis
      .transition(t)
      .call(xAxisCall)
    yAxis
      .transition(t)
      .call(yAxisCall)

    var xLabel = ref[1].Label,
        yLabel = ref[2].Label,
        zLabel = ref[9].Label,
        xInfo = ref[1].Categories,
        yInfo = ref[2].Categories,
        zInfo = ref[9].Categories
    ref.forEach(function(d){
      if (d["Variable"] == xData) {
        xLabel = d.Label
        xInfo = d.Categories
      }
      if (d["Variable"] == yData) {
        yLabel = d.Label
        yInfo = d.Categories
      }
      if (d["Variable"] == zData) {
        zLabel = d.Label
        zInfo = d.Categories
      }
    })
    d3.select("#axisInfoX").html("Label " + "\"" + xLabel + "\"" + " is graded as follows:<br/>" + xInfo.toString() + "<br/>Negative answers are not included in the graph data.");
    d3.select("#axisInfoY").html("Label " + "\"" + yLabel + "\"" + " is graded as follows:<br/>" + yInfo.toString() + "<br/>Negative answers are not included in the graph data.");
    d3.select("#axisInfoZ").html("Label " + "\"" + zLabel + "\"" + " is graded as follows:<br/>" + zInfo.toString() + "<br/>Negative answers are not included in the graph data.<br/>Bigger bubbles correspond to higher values.");

    d3.select('#xOpts').on('change', function() {
      var input = eval(d3.select(this).property('value'));
      return update(input, yData, zData, wave)
    })
    d3.select('#yOpts').on('change', function() {
      var input = eval(d3.select(this).property('value'));
      return update(xData, input, zData, wave)
    })
    d3.select('#zOpts').on('change', function() {
      var input = eval(d3.select(this).property('value'));
      if (input == null) {
        //input = "defaultBubbles";
      }
      return update(xData, yData, input, wave)
    })
    d3.select('#waveOpts').on('change', function() {
      var input = eval(d3.select(this).property('value'));
      return update(xData, yData, zData, input)
    })
  })
}
