var div = document.getElementById('cnv');
var width = div.clientWidth;
var height = (width/4)*3;
var bubbleSize = 10;

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

update(xData = "A170", yData = "A173", wave = 6)

function update(xData, yData, wave) {
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

    xScale.domain(d3.extent(stats, function (d) {
      return +d[xData]
    }))
    .nice();

    yScale.domain(d3.extent(stats, function(d, i) {
      return +d[yData]
    }))
    .nice();

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
        return bubbleSize;
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
          return bubbleSize;
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
            tooltip.html(d.Country + "<br/>")
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
    xAxis.call(xAxisCall)
    yAxis.call(yAxisCall)

    var xLabel,
        yLabel,
        xInfo,
        yInfo
    ref.forEach(function(d){
      if (d["Variable"] == xData) {
        xLabel = d.Label
        xInfo = d.Categories
      } else if (d["Variable"] == yData) {
        yLabel = d.Label
        yInfo = d.Categories
      }
    })
    d3.select("#axisInfoX").html("Label " + "\"" + label + "\"" + " is graded as follows:" + "<br/>" + info);
    d3.select("#axisInfoY").html("Label " + "\"" + label + "\"" + " is graded as follows:" + "<br/>" + info);
    //d3.select("#axisInfoZText").text("Label " + "\"" + label + "\"" + " is graded as follows:" + info);

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
