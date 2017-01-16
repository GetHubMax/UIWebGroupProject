function drawLine(name,data){
// passes in an array of team names and a 2d array of the placeing. 




//var margin = {top: 20, right: 20, bottom: 30, left: 50},
 //   width = 960 - margin.left - margin.right,
  //  height = 500 - margin.top - margin.bottom;


//test
console.log("dawing line shart");

var data = [[3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 7],
         [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
          [2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2],
          [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 10],
          [3, 5, 2, 7, 5, 2, 1, 3, 8, 9, 2, 6, 7],
          [3, 6, 6, 7, 5, 2, 1, 3, 8, 9, 7, 5, 7],
          [3, 6, 2, 7, 5, 2, 1, 3, 8, 6, 2, 5, 7],
          [3, 6, 2, 7, 6, 2, 1, 3, 5, 9, 2, 5, 7],
          [3, 6, 2, 7, 5, 8, 1, 4, 8, 9, 2, 5, 7],
          [3, 6, 2, 7, 5, 2, 6, 3, 8, 9, 2, 5, 7]
          ];

if (!data) { return; }
          
var team0 = data[0],
team1 = data[1],
team2 = data[2],
team3 = data[3],
team4 = data[4],
team5 = data[5],
team6 = data[6],
team7 = data[7],
team8 = data[8],
team9 = data[9];
         
          
var name = ["colThunderbirds", "colPulse",
            "colTactix","colVixens",
            "colMystics","colFirebirds",
            "colSteel","colSwifts",
            "colFever","colMagic"];

w = 400,
h = 200,
margin = 20,
y = d3.scale.linear().domain([0, 10]).range([0 + margin, h - margin]),
x = d3.scale.linear().domain([0, data.length]).range([0 + margin, w - margin])
  
var vis = d3.select("#graphContainer")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
	.attr("name", "temp");
 
var g = vis.append("svg:g")
    .attr("transform", "translate(0, 200)");



var line = d3.svg.line()
    .x(function(d,i) { return x(i); })
    .y(function(d) { return -1 * y(d); })


g.append("svg:path").attr("d", line(team0)).attr("class",name[0]);
g.append("svg:path").attr("d", line(team1)).attr("class",name[1]);
g.append("svg:path").attr("d", line(team2)).attr("class",name[2]);
g.append("svg:path").attr("d", line(team3)).attr("class",name[3]);
g.append("svg:path").attr("d", line(team4)).attr("class",name[4]);
g.append("svg:path").attr("d", line(team5)).attr("class",name[5]);
g.append("svg:path").attr("d", line(team6)).attr("class",name[6]);
g.append("svg:path").attr("d", line(team7)).attr("class",name[7]);
g.append("svg:path").attr("d", line(team8)).attr("class",name[8]);
g.append("svg:path").attr("d", line(team9)).attr("class",name[9]);


         
   
  

g.append("svg:line")
    .attr("x1", x(0))
    .attr("y1", -1 * y(0))
    .attr("x2", x(w))
    .attr("y2", -1 * y(0))
 
g.append("svg:line")
    .attr("x1", x(0))
    .attr("y1", -1 * y(0))
    .attr("x2", x(0))
    .attr("y2", -1 * y(d3.max(data)))


g.selectAll(".xLabel")
    .data(x.ticks(5))
    .enter().append("svg:text")
    .attr("class", "xLabel")
    .text(String)
    .attr("x", function(d) { return x(d) })
    .attr("y", 0)
    .attr("text-anchor", "middle")
 
g.selectAll(".yLabel")
    .data(y.ticks(4))
    .enter().append("svg:text")
    .attr("class", "yLabel")
    .text(String)
    .attr("x", 0)
    .attr("y", function(d) { return -1 * y(d) })
    .attr("text-anchor", "right")
    .attr("dy", 4)


g.selectAll(".xTicks")
    .data(x.ticks(5))
    .enter().append("svg:line")
    .attr("class", "xTicks")
    .attr("x1", function(d) { return x(d); })
    .attr("y1", -1 * y(0))
    .attr("x2", function(d) { return x(d); })
    .attr("y2", -1 * y(-0.3))
 
g.selectAll(".yTicks")
    .data(y.ticks(4))
    .enter().append("svg:line")
    .attr("class", "yTicks")
    .attr("y1", function(d) { return -1 * y(d); })
    .attr("x1", x(-0.3))
    .attr("y2", function(d) { return -1 * y(d); })
    .attr("x2", x(0))

}
 
