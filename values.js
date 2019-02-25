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

update(xData = "A170");

function update(xData) {
  d3.csv("stats.csv").then(function(stats){
    var bubbles = d3.select("#graph")
      .selectAll("datapoints")
        .data(stats);

    stats.forEach(function(d){
      //console.log(d);
    })

    xScale.domain(d3.extent(stats, function (d) {
      return +d[xData]
    }))
    .nice();

    yScale.domain(d3.extent(stats, function(d, i) {
      //return +d[""]
      return i
    }))
    .nice();

    bubbles.enter().append("circle")
      .attr("cx", function(d, i){
        //return xScale(i)
        return xScale(+d[xData]);
      })
      .attr("cy", function(d, i) {
        //return graphHeight/2;
        return yScale(i);
      })
      .attr("r", function(d){
        /*
        return yScaleRight(+d["percent position"])
        */
        return 2;
      })
      .attr("fill", "grey")
      .attr("opacity", 1)

    var yAxisCall = d3.axisLeft(yScale)
      .tickSize(5)
      .tickPadding(2)  //offset away from axis
    var yAxis = d3.select("#canvas").append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(yAxisCall)

    var xAxisCall = d3.axisBottom(xScale)
        .tickSize(5)
        .tickPadding(2)  //offset away from axis
    var xAxis = d3.select("#canvas").append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
        .call(xAxisCall)
  });
}


/*
d3.interval(function(){
  yScale = useLogScale ? yLogScale : yLinearScale;
  yScale.domain(d3.extent(trades, function(d) {
    return +d["Volume"]
  })).nice();
  yAxis.call(
    d3.axisLeft(yScale)
      .tickSize(3)
      .tickPadding(10)
  );
  bars.attr("height", 1);
  useLogScale = !useLogScale;
}, 1000)
*/
