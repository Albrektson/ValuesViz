var width = 1280,
    height = 800;

var margin = {top: 20, right: 20, bottom: 80, left: 60},
    graphWidth = width - margin.left - margin.right,
    graphHeight = height - margin.top - margin.bottom;

//create svg canvas
var svg = d3.select("body").append("svg")
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
  .attr("class", "x-axis-title")
  .attr("transform", "translate(" + graphWidth/2 + "," + (height-40) +")")
  .text("X AXIS")
d3.select("#canvas").append("text")
  .attr("class", "y-axis-title")
  .attr("transform", "translate(" + 20 + "," + (graphHeight/2) +"), rotate(-90)")
  .text("Y AXIS")

update(xData = "A170", yData = "A173", wave = 5)

function update(xData, yData, wave) {
  d3.csv("stats.csv").then(function(stats){
    var bubbles = d3.select("#graph")
      .selectAll("circle")
        .data(stats, function(d){
          return xData + d[xData];
        });

    xScale.domain(d3.extent(stats, function (d) {
      return +d[xData]
    }))
    .nice();

    yScale.domain(d3.extent(stats, function(d, i) {
      return +d[yData]
    }))
    .nice();

    //update values
    bubbles
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
        return 3;
      }
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
          return 3;
        }
      })
      .attr("fill", "grey")
      .attr("stroke", "steelblue")
      .attr("opacity", 0.75)
      .attr("id", function(d){
        return d["Country"]+d["Wave"]
      });

    bubbles.exit().remove()

    //update and scale axes
    xAxis.call(xAxisCall)
    yAxis.call(yAxisCall)

    d3.select('#xOpts').on('change', function() {
      var input = eval(d3.select(this).property('value'));
      return update(input, yData, wave)
    })
    d3.select('#yOpts').on('change', function() {
      var input = eval(d3.select(this).property('value'));
      return update(xData, input, wave)
    })
    d3.select('#sizeOpts').on('change', function() {
      var input = eval(d3.select(this).property('value'));
      return update(xData, yData, wave)
    })
    d3.select('#waveOpts').on('change', function() {
      var input = eval(d3.select(this).property('value'));
      return update(xData, yData, input)
    })
  })
}
