var current = "H";
var home = "H";
var team = "T";
var season = "S";
var teamList = [];
var clickTeam;
var t1=-1, t2=-1;
var mainwidth  = 400;
var mainheight = 200;

var isPieGraph = 1;//true;

function SetTitle(txt) {
	var t = d3.select("#dynTitle");
	t.innerHTML = txt;
}

function addGButton(){
	console.log("add Button");
	d3.select("#graphContainer")
	.append("img")
	.text("button")
	.attr("id", "gButton")
	.attr("name","temp")
	.style("opacity", 1)
	.attr("src", "gButton1.jpg")
	.on("click",gSwicth);
	console.log("add Button");
}

function gSwicth(){
	if (isPieGraph == 1) {
		isPieGraph = 0;
		//drawBarGraph();
	} else {
		//clearBarGraph();
		isPieGraph =1;
	}

	console.log("click "+isPieGraph);
	if (isPieGraph ==1) {
		d3.select("#gButton")	
			.attr("src","gButton1.jpg")
	} else {
		d3.select("#gButton")	
			.attr("src","gButton0.jpg")
	}
	updateGraph();
}

function ClearGraph() {
	d3.select("#graph").selectAll("*").remove();
}

function Clear() {
	if (teamList.length == 0) {
		var i = 0;
		teamList[i]="All";i++;
		teamList[i]="NZ";i++;
		teamList[i]="AUS";i++;
		teamList[i]="Adelaide Thunderbirds";i++;
		teamList[i]="Melbourne Vixens";i++;
		teamList[i]="New South Wales Swifts";i++;
		teamList[i]="Queensland Firebirds";i++;
		teamList[i]="West Coast Fever";i++;
		teamList[i]="Mainland Tactix";i++;
		teamList[i]="Central Pulse";i++;
		teamList[i]="Northern Mystics";i++;
		teamList[i]="Southern Steel";i++;
		teamList[i]="Waikato Bay of Plenty Magic";i++;
	}
	FadeOut();
	var t = d3.selectAll("[name=season]");
	t.remove();
	t = d3.selectAll("[name=venue]");
	t.remove();
	t = d3.selectAll("[name=data]");
	t.remove();
	var tmp = d3.selectAll("[name=temp]");
	tmp.remove();
	var twit = d3.selectAll("#twitter-widget-0");
	twit.remove();
	var twit2 = d3.selectAll("#rufous-sandbox");
	twit2.remove();
	var twit3 = d3.selectAll("#twitter-wjs");
	twit3.remove();
	clickTeam = null;
}

function Home() {
	console.log("current: " + current);
	if (current == Home) {
		console.log("Home function call ignored");
		return;
	}
	Clear();
	CreateMap();
	AddTwitter();	
	current = home;
	FadeIn();
}

function FadeIn() {
	d3.selectAll("[name=fade]").transition().duration(500).style("opacity", 1);
}

function FadeOut() {
	d3.selectAll("[name=fade]").transition().duration(500).style("opacity", 0);
}


function CreateMap() {
	d3.select("#graphContainer").attr("id", "mapContainer").style("opacity", 0).attr("name", "fade");
	var mapPanel = d3.select("#mapContainer");
	mapPanel.append("img").attr("src", "map.png").attr("alt", "aus/nz map").attr("usemap", "#Map").attr("name", "temp");
	var map = mapPanel.append("map").attr("name", "temp").attr("id", "Map");
	//map.append("area").attr("title", "fever").on("click", Team("West Coast Fever")).attr("shape", "poly").attr("coords", "98,258,141,257,140,315,98,319");
	map.append("area").attr("title", "Fever").on("click", function () {Team("West Coast Fever");}).attr("shape", "poly").attr("coords", "98,258,141,257,140,315,98,319").attr("class", "mapButton");
	map.append("area").attr("title", "Thunderbirds").on("click", function () {Team("Adelaide Thunderbirds");}).attr("shape", "poly").attr("coords", "319,293,384,289,384,334,324,344").attr("class", "mapButton");
	map.append("area").attr("title", "Vixens").on("click", function () {Team("Melbourne Vixens");}).attr("shape", "poly").attr("coords", "397,351,446,350,446,406,401,402").attr("class", "mapButton");
	map.append("area").attr("title", "Firebirds").on("click", function () {Team("Queensland Firebirds");}).attr("shape", "poly").attr("coords", "446,192,497,189,513,249,451,260").attr("class", "mapButton");
	map.append("area").attr("title", "Swifts").on("click", function () {Team("New South Wales Swifts");}).attr("shape", "poly").attr("coords", "465,294,519,288,521,327,470,326").attr("class", "mapButton");
	map.append("area").attr("title", "Mystics").on("click", function () {Team("Northern Mystics");}).attr("shape", "poly").attr("coords", "672,220,725,221,725,264,675,264").attr("class", "mapButton");
	map.append("area").attr("title", "Magic").on("click", function () {Team("Waikato Bay of Plenty Magic");}).attr("shape", "poly").attr("coords", "676,284,728,281,727,315,682,317").attr("class", "mapButton");
	map.append("area").attr("title", "Pulse").on("click", function () {Team("Central Pulse");}).attr("shape", "poly").attr("coords", "697,348,767,346,767,374,703,375").attr("class", "mapButton");
	map.append("area").attr("title", "Tactix").on("click", function () {Team("Mainland Tactix");}).attr("shape", "poly").attr("coords", "644,403,711,403,712,436,637,435").attr("class", "mapButton");
	map.append("area").attr("title", "Steel").on("click", function () {Team("Southern Steel");}).attr("shape", "poly").attr("coords", "582,461,629,458,629,499,583,498").attr("class", "mapButton");
}

function AddTwitter() {
	var sidePanel = d3.select("#sidebarContainer");
	sidePanel.append("a").attr("class", "twitter-timeline").attr("href", "https://twitter.com/ANZChamps").attr("data-widget-id", "614726693844955136").text("Tweets by @ANZChamps").attr("name", "temp");
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
//	<a class="twitter-timeline" href="https://twitter.com/ANZChamps" data-widget-id="614726693844955136">Tweets by @ANZChamps</a>

}

function Team(team1, team2) {
	//Do something with passed team names
	if (current == team) {
		console.log("Home function call ignored");
		return;
	}
	Clear();
	clickTeam = team1;
	SideTeam();
	loadData();
	current = team;
	console.log("Team function passed team1: " + team1);
}

function SideTeam() {
	var side = d3.select(".sidebar");
	console.log("side: " + side);
	side.append("p").text("Clear All").attr("name", "temp").attr("class", "sideButton").on("click", function() { resetSidebar() });
	side.append("p").text("SEASON").attr("name", "temp").attr("id", "sideSeason").attr("class", "sideButton").on("click", function() {hideSeasons()});
	side.append("p").text("VENUE").attr("name", "temp").attr("id", "sideVenue").attr("class", "sideButton").on("click", function() {hideVenues()});
	side.append("p").text("DATA").attr("name", "temp").attr("id", "sideData").attr("class", "sideButton").on("click", function() {hideDatas()});
}

function currentTeams() {
	var ans = [];
	if (t1 != null && t1 != -1) { ans[0] = teamList[t1]; }
	else {
		for (i = 0; i < 13; i++) {
			var b = d3.select("[name=opt1-" + i + "]").attr("selected");
			if (b) {
				ans[0] = teamList[i];
				break;
			}
		}
	}
	if (t2 != null && t2 != -1) { ans[1] = teamList[t2]; }
	else {
		for (i = 0; i < 13; i++) {
			var b = d3.select("[name=opt2-" + i + "]").attr("selected");
			if (b) {
				ans[1] = teamList[i];
				break;
			}
		}
	}
	return ans;
}

function Team2() {
	MainTeam(clickTeam);
	getData(teamList[t1], teamList[t2]);
	addGButton();
	FadeIn();
}

function GetTeamID(team) {
	console.log("TeamList: " + teamList.length);
	for (i = 0; i < teamList.length; i++) {
		if (teamList[i] == team) {
			return i;
		}
	}
	return -1;
}

function dropChange(n, id) {
	console.log("dropChange: " + n + ", " + id + ", " + t1 + ", " + t2);
	if (id >= 9) { id--; }
	if (id >= 3) { id--; }
	if (n == 0) { d3.select("[name=opt1-" + t1 + "]").attr("selected", false); t1 = id; d3.select("[name=opt1-" + t1 + "]").attr("selected", true); }
	if (n == 1) { d3.select("[name=opt2-" + t2 + "]").attr("selected", false); t2 = id; d3.select("[name=opt2-" + t2 + "]").attr("selected", true);}
	updateGraph();
}

function dropUnselect(n) {
	for (i = 0; i < teamList.length; i++) {
		if (n == 0) {
			d3.select("[name=opt1-" + i + "]").attr("selected", false);
		} else {
			d3.select("[name=opt2-" + i + "]").attr("selected", false);
		}
	}
}

function MainTeam(team1, team2) {
	var panel = d3.select("#mapContainer");
	if (!panel) {
		panel = d3.select("#graphContainer");
	} else {
		panel.attr("id", "graphContainer");
	}
	panel.style("opacity", 0).attr("name", "fade");
	
	
	var i = 0;
	//Find option that corresponds to team
	if (team1 != null && t1 == -1) {
		t1 = GetTeamID(team1);
	}
	if (team2 != null && t2 == -1) {
		t2 = GetTeamID(team2);
	}
	//t1 = 3;
	
	i = 0;
	var opt = "opt1-";
	//var box = d3.select("#mapContainer");
	var box = d3.select("#graphContainer");
	var p = box.append("div").attr("class", "dropDown").attr("name", "temp").append("p").attr("white-space", "nowrap");
	var s = p.append("select").attr("id", "select1").on("change", function() { dropChange(0, this.selectedIndex); });
	s.append("option").text("All").attr("name", opt + i);i++;
	s.append("option").text("NZ teams").attr("name", opt + i);i++;
	s.append("option").text("AUS teams").attr("name", opt + i);i++;
	s.append("option").text("----------------").attr("disabled", "true");
	s.append("option").text("Adelaide Thunderbirds").attr("name", opt + i);i++;
	s.append("option").text("Melbourne Vixens").attr("name", opt + i);i++;
	s.append("option").text("New South Wales Swifts").attr("name", opt + i);i++;
	s.append("option").text("Queensland Firebirds").attr("name", opt + i);i++;
	s.append("option").text("West Coast Fever").attr("name", opt + i);i++;
	s.append("option").text("----------------").attr("disabled", "true");
	s.append("option").text("Mainland Tactix").attr("name", opt + i);i++;
	s.append("option").text("Central Pulse").attr("name", opt + i);i++;
	s.append("option").text("Northern Mystics").attr("name", opt + i);i++;
	s.append("option").text("Southern Steel").attr("name", opt + i);i++;
	s.append("option").text("Waikato BOP Magic").attr("name", opt + i);i++;
	p.append("span").text(" vs ");
	var s = p.append("select").attr("id", "select2").on("change", function() { dropChange(1, this.selectedIndex); });
	opt = "opt2-";
	i = 0;
	s.append("option").text("All").attr("name", opt + i);i++;
	s.append("option").text("NZ teams").attr("name", opt + i);i++;
	s.append("option").text("AUS teams").attr("name", opt + i);i++;
	s.append("option").text("----------------").attr("disabled", "true");
	s.append("option").text("Adelaide Thunderbirds").attr("name", opt + i);i++;
	s.append("option").text("Melbourne Vixens").attr("name", opt + i);i++;
	s.append("option").text("New South Wales Swifts").attr("name", opt + i);i++;
	s.append("option").text("Queensland Firebirds").attr("name", opt + i);i++;
	s.append("option").text("West Coast Fever").attr("name", opt + i);i++;
	s.append("option").text("----------------").attr("disabled", "true");
	s.append("option").text("Mainland Tactix").attr("name", opt + i);i++;
	s.append("option").text("Central Pulse").attr("name", opt + i);i++;
	s.append("option").text("Northern Mystics").attr("name", opt + i);i++;
	s.append("option").text("Southern Steel").attr("name", opt + i);i++;
	s.append("option").text("Waikato BOP Magic").attr("name", opt + i);i++;
	
	//Set default selection
	if (t1 != -1) {
		d3.select("[name=opt1-" + t1 + "]").attr("selected", true);
		if (t1 > 2) {
			if (t1 <= 7) {
				t2 = 1;
			} else { 
				t2 = 2;
			}
		}
	} else {
		d3.select("[name=opt1-1]").attr("selected", true);
	}
	
	if (t2 != -1) {
		d3.select("[name=opt2-" + t2 + "]").attr("selected", true);
	} else {
		d3.select("[name=opt2-2]").attr("selected", true);
	}
	
	//Go button
	p.append("span").text('\u2192').on("Click", function() { Go(); });
	
	//Dynamic Title
	box.append("div").attr("name", "temp").attr("class", "dynTitle").append("p").text("");
	
	//Graph
	box.append("svg").attr("name", "temp").attr("id", "graph").attr("width", "100%").attr("height", "600");
	
	//Graph Key
	box.append("div").attr("name", "temp").attr("class", "graphKey").append("p").text("");
	
	
}

function Season() {
	if (current == season) {
		return;
	}
	Clear();
	//Load sidebar for season
	//Load graph panel for season
	
	current = season;
	var panel = d3.select("#mapContainer");
	if (!panel) {
		panel = d3.select("#graphContainer");
	} else {
		panel.attr("id", "graphContainer");
	}
	panel.style("opacity", 0).attr("name", "fade");
	
	drawLine();
	FadeIn();
}

function Go() {
	console.log("Team go button clicked");
}
