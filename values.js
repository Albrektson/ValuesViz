var width = 1280,
    height = 800;

var margin = {top: 20, right: 20, bottom: 20, left: 40},
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
  .tickSize(5)
  .tickPadding(2)
var yAxis = d3.select("#canvas").append("g")
  .attr("class", "y-axis")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(yAxisCall)

var xAxisCall = d3.axisBottom(xScale)
    .tickSize(5)
    .tickPadding(2)
var xAxis = d3.select("#canvas").append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
    .call(xAxisCall)

update(xData = "A170", yData = "A173", wave = 6)
/*
var x = false;
setInterval(function() {
  if (x) {
    update(xData = "A170", wave = 6);
    x = false;
  } else {
    update(xData = "A173", wave = 6);
    x = true;
  }
}, 3000);
*/
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
        //return xScale(i)
        return xScale(+d[xData]);
      })

    bubbles.enter().append("circle")
      .attr("cx", function(d, i){
        return xScale(+d[xData]);
      })
      .attr("cy", function(d, i) {
        return yScale(+d[yData]);
      })
      .attr("r", function(d){
        if (+d["Wave"] == wave) {
            return 3;
        } else {
          return 0;
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
  })
}
