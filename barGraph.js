 
function  drawBarGraph123123(){
console.log("draw bar Grap")

var data= [["colPulse",5],[ "colTactix",3]];
var vis = d3.select("#graph")
    .append("svg:svg")
    .attr("class", "bar")
    .attr("width", mainwidth)
    .attr("height", mainheight)

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

   vis.selectAll("div")
   			.data(data)
   			.enter().append("div")

   		.attr("name","tmp").attr("class",function(d){return d[0];})

    .attr("height", mainheight)
   			.style("width", function(d) { return x(d[1]) + "px"; })
   			.text(function(d){return d[0];})




} 

function drawBarGraph(team1, team2, value1, value2, array1, array2, text, names) {
	console.log("draw BarGraph");
	                            // opt    opt    opt
	//Team1, team2, wins, losses, array, array, text
	var colours = getTeamColours(team1, team2);
	var colour1 = colours[0];
	var colour2 = colours[1];
	var border = colours[2];
	
	var total = Math.max(value1,value2);
	var vP1 = value1 / total * 400;
	var vP2 = value2 / total * 400;
	
	var data2 = [];
	
	var w = parseInt(d3.select("body").select("svg").style("width"));
	var h = parseInt(d3.select("body").select("svg").style("height"));
	var width = w / 2.0; 
	var height = h / 2.0;
	var wBar = w * .15;
	var xBar = w * .2;
	
	var p1 = 6, p2 = 0;
	for (i = 0; i < array1.length; i++) {
		p2 = array1[i] / value1 * (vP1-12);
		p1 += p2;
		data2[i] = [p1, greyColours[i], names[i], array1[i], p2, width-wBar*1.5+10];
	}
	var j = array1.length;
	p1 = 6; p2 = 0;
	for (i = 0; i < array2.length; i++) {
		p2 = array2[i] / value2 * (vP2-12);
		p1 += p2;
		data2[i+j] = [p1, greyColours[i], names[i], array2[i], p2, width+wBar*.5+10];
	}
	
	
	
	
	
	//var data2 = [[0,23, "#AA8888"],[23, 40, "#88BB88"], [40,100,"#8888CC"]];
	var vis = d3.select("#graph");
	vis.selectAll("rect").remove();
	
	
	
	
	
	var data = [[vP1, colour1, team1, value1, width-wBar*1.5],[vP2, colour2, team2, value2, width+wBar*.5]];
	
	console.log(width);
	console.log(height);
	var trans = "translate(" + width + "," + height + ")";
	//var trans2 = "translate(20," + (height*.9) + ")";
	
	vis.append("rect").attr("x", (w * .05)).attr("y", (h*.85))
	.attr("width", (w*.9)).attr("height", (h*.07)).style("fill", "none")
	.attr("stroke", "black").attr("stroke-width", "4").attr("name", "temp");
	
	
	vis.append("rect").attr("width", 10).attr("height", 10).attr("x", (width-200)).attr("y", (h * .86)).style("fill", colour1).attr("stroke", "black").attr("stroke-width", "1");
	vis.append("text").attr("width", 10).attr("height", 10).attr("x", (width-200 + 15)).attr("y", (h * .86 + 10)).style("fill", "black").text(team1);
	vis.append("rect").attr("width", 10).attr("height", 10).attr("x", (width+100)).attr("y", (h * .86)).attr("stroke", "black").attr("stroke-width", "1").style("fill", colour2);
	vis.append("text").attr("width", 10).attr("height", 10).attr("x", (width+115)).attr("y", (h * .86 + 10)).style("fill", "black").text(team2);
	var za = 100;
	var zb = 15;
	var start = width - (za*names.length/2.0);
	for (i = 0; i < names.length; i++) {
		vis.append("rect").attr("width", 10).attr("height", 10).attr("x", start + za*i).attr("y", (h * .86 + 15)).style("fill", greyColours[i]).attr("stroke", "black").attr("stroke-width", "1");
		vis.append("text").attr("width", 10).attr("height", 10).attr("x", start + 15 + za*i).attr("y", (h * .86 + 25)).style("fill", "black").text(names[i]);
	}
	
	vis.selectAll("squig")
		.data(data)
		.enter()
		.append("rect").attr("x", function(d) { return d[4]; })
		.attr("y", function(d) { return 470 - d[0]; })
		.attr("width", wBar).attr("height", function(d) { return d[0]; })
		.style("fill", function(d){return d[1];})
		.attr("stroke", "black").attr("stroke-width", "4")
		.append("svg:title").text(function(d) { return d[2] + ": " + d[3]; });
	vis.selectAll("yoy")
		.data(data2)
		.enter()
		.append("rect").attr("x", function(d) { return d[5]; })
		.attr("y", function(d) { return 470 - d[0]; })
		.attr("width", wBar-20).attr("height", function(d) { return d[4]; })
		.style("fill", function(d){return d[1];})
		.attr("stroke", "black").attr("stroke-width", "4")
		.append("svg:title").text(function(d) { return d[2] + ": " + d[3]; });
}

