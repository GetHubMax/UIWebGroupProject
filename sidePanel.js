 
//Season
	//All
	//2008
	//...
	//2013
var currentSeason = "All";
var currentVenue = "All";
var currentDataType ="Win/Loss";
var currentTeam1 = "NZ";
var currentTeam2 = "AUS";
var seasonData;
var venueData;
var hidden = [0, 0, 0];

function currentDataState(){
		return [currentSeason, currentVenue, currentDataType];
}

function resetSidebar() {
	console.log("Reset sidebar");
	currentSeason = "All";
	currentVenue = "All";
	currentDataType = "Win/Loss";
	
	//reset buttons
	updateGraph();
}

function loadSidebar(){
	//console.log("loadSideBar");
	//getDataFormDB("SELECT DISTINCT Date, colNameFROM anz");
	
	//loadDatatypes(["Win Lose"]);

	console.log("test get data from "+getDataFromDB("SELECT DISTINCT Season FROM anz;"));
	loadSeasons(getDataFromDB("SELECT DISTINCT Season  FROM anz;"));
	loadVenues(getDataFromDB("SELECT DISTINCT Venue FROM anz;"));
	displayDatas();
	Team2();
	updateGraph();
}

function loadSeasons(seasons){
	seasonData = seasons;
	displaySeasons();
}

function displaySeasons() {
	var vis = d3.select(".sidebar").insert("div", "#sideVenue").attr("class", "sidebarSegmentSeason").attr("name", "season");
	vis.append("p")
		.text("All")
		.attr("id", "seasonAll")
		.attr("class", "sideLabel")
		.on("click", function(i) {
		seasonClick(this);});
		
	for (i = 0; i < seasonData.length; i++) {
		//vis.insert("p", "#sideVenue")
		vis.append("p")
		.text(seasonData[i])
		.attr("id", seasonData[i])
		.attr("class", "sideLabel")
		.on("click", function(i) {
		seasonClick(this);
	});
	}
}

function hideSeasons() {
	console.log("HideSeasons: " + hidden[0]);
	if (hidden[0] == 0) {
		var s = d3.selectAll("[name=season]");
		s.transition().duration(500).style("opacity", 0);
		s.remove();
		hidden[0] = 1;
	} else {
		displaySeasons();
		hidden[0] = 0;
	}
}

function loadVenues(venues) {
	venueData = venues;
	displayVenues();
}

function displayVenues(){
	var vis = d3.select(".sidebar").insert("div", "#sideData").attr("class", "sidebarSegmentVenue").attr("name", "venue");
	
	//vis.insert("p", "#sideData")
	vis.append("p")
		.text("All")
		.attr("id", "venueAll")
		.attr("class", "sideLabel")
		.on("click", function(i) {
		venueClick(this);});
	
	vis.append("p")
		.text("Home")
		.attr("id", "venueHome")
		.attr("class", "sideLabel")
		.on("click", function(i) {
		venueClick(this);});
	
	vis.append("p")
		.text("Away")
		.attr("id", "venueAway")
		.attr("name", "venue")
		.attr("class", "sideLabel")
		.on("click", function(i) {
		venueClick(this); });
	
	for (i = 0; i < venueData.length; i++) {
	vis.append("p")
		.text(venueData[i])
		.attr("id", venueData[i])
		.attr("name", "venue")
		.attr("class", "sideLabel")
		.on("click", function(i) {
		venueClick(this);
	});
	}
}

function hideVenues() {
	if (!hidden[1]) {
		var v = d3.selectAll("[name=venue]");
		v.transition().duration(500).style("opacity", 0);
		v.remove();
		hidden[1] = 1;
	} else {
		displayVenues();
		hidden[1] = 0;
	}
}

function loadDatas() {
	console.log("Nothing!!");
}

function hideDatas() {
	if (!hidden[2]) {
		var v = d3.selectAll("[name=data]");
		v.transition().duration(500).style("opacity", 0);
		v.remove();
		hidden[2] = 1;
	} else {
		displayDatas();
		hidden[2] = 0;
	}
}

function displayDatas(){
	var vis = d3.select("sidebar").selectAll("div");
	console.log("sidepanel venue");
	
	var vis = d3.select(".sidebar").append("div").attr("class", "sidebarSegmentData").attr("name", "data");
	
	//vis.insert("p", "#sideData")
	vis.append("p")
		.text("Win/Loss")
		.attr("id", "venueAll")
		.attr("class", "sideLabel")
		.on("click", function(i) {
		dataClick(this);});
	
	vis.append("p")
		.text("Goals")
		.attr("id", "venueAway")
		.attr("name", "venue")
		.attr("class", "sideLabel")
		.on("click", function(i) {
		dataClick(this); });
}

function dataClick(d){
	currentDataType = d.innerHTML;
	console.log("currentDataType "+currentDataType);
	updateGraph();
}

function seasonClick(d){
	currentSeason = d.innerHTML;
	console.log("currentSeason "+currentSeason);
	updateGraph();
}

function  venueClick(d){
	currentVenue= d.innerHTML;
	console.log("currentVenue "+ currentVenue);
	updateGraph();
}

function updateGraph() {
	ClearGraph();
	getData();
}