function drawPieGraph(team1, team2, value1, value2, array1, array2, text, names) {
	console.log("draw PieGraph");
	                            // opt    opt    opt
	//Team1, team2, wins, losses, array, array, text
	var colours = getTeamColours(team1, team2);
	var colour1 = colours[0];
	var colour2 = colours[1];
	var border = colours[2];
	
	var total = value1 + value2;
	var vP1 = value1 / total * 100;
	var vP2 = value2 / total * 100;
	
	var data2 = [];
	
	var p1 = 2, p2 = 2;
	for (i = 0; i < array1.length; i++) {
		p2 += array1[i] / value1 * (vP1-4);
		data2[i] = [p1, p2, greyColours[i], names[i], array1[i]];
		p1 = p2;
	}
	var j = array1.length;
	p1 = vP1 + 2; p2 = p1;
	for (i = 0; i < array2.length; i++) {
		p2 += array2[i] / value2 * (vP2-4);
		data2[i+j] = [p1, p2, greyColours[i], names[i], array2[i]];
		p1 = p2;
	}
	
	
	var cScale =d3.scale.linear().domain([0,100]).range([0,2* Math.PI]);
	
	var data = [[0,vP1, colour1, team1, value1],[vP1, 100, colour2, team2, value2]];
	//var data2 = [[0,23, "#AA8888"],[23, 40, "#88BB88"], [40,100,"#8888CC"]];
	var vis = d3.select("#graph");
	vis.selectAll("rect").remove();
	
	var arc = d3.svg.arc().innerRadius(0).outerRadius(100)	
	.startAngle(function(d){return cScale(d[0])}) 
	.endAngle(function(d){return cScale(d[1])});
	var arc2 = d3.svg.arc().innerRadius(0).outerRadius(200)
	.startAngle(function(d){return cScale(d[0])}) 
	.endAngle(function(d){return cScale(d[1])});
	
	var w = parseInt(d3.select("body").select("svg").style("width"));
	var h = parseInt(d3.select("body").select("svg").style("height"));
	var width = w / 2.0; 
	var height = h / 2.0;
	
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
	
	
	
	vis.selectAll("path")
		.data(data)
		.enter()
		.append("path").attr("d", arc2)
		.style("fill", function(d){return d[2];})
		.attr("stroke", "black").attr("stroke-width", "4")
		.attr("transform", trans)
		.append("svg:title").text(function(d) { return d[3] + ": " + d[4]; });
		
	vis.selectAll("path2")
		.data(data2)
		.enter()
		.append("path").attr("d", arc)
		.style("fill", function(d){return d[2];})
		.attr("stroke", "black").attr("stroke-width", "2")
		.attr("transform", trans)
		.append("svg:title").text(function(d) { return d[3] + ": " + d[4]; });
}