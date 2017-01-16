var text = [];
var mainPanel;
var loadingPanel;
var seasonsMax = 6;
var seasonsLoaded = 0;
var seasons;
var done;
var db; //Database
var columns = 9;
var midSeason = 5;
var lateSeason = 10;
var finals = 14;

var NZ = "('Cantebury Tactix', 'Central Pulse', 'Northern Mystics', 'Southern Steel', 'Waikato Bay of Plenty Magic')";
var AUS = "('Adelaide Thunderbirds', 'Melbourne Vixens', 'New South Wales Swifts', 'Queensland Firebirds', 'West Coast Fever')";
var All = "('Cantebury Tactix', 'Central Pulse', 'Northern Mystics', 'Southern Steel', 'Waikato Bay of Plenty Magic', 'Adelaide Thunderbirds', 'Melbourne Vixens', 'New South Wales Swifts', 'Queensland Firebirds', 'West Coast Fever')";

var TeamColours = {};
var Teams = {};
var c1 = "#00ACEE";
var c2 = "#F00492";
var title;
var seasonList;
var rounds = ["Early Season", "Mid Season", "Late Season", "Finals"];

var greyColours = ["#E6E6E6","#D3D3D3","#BEBEBE","#ABABAB","#9A9A9A","#8B8B8B","#7D7D7D","#707070","#656565","#5B5B5B"];

function loadTeamColours() {
	TeamColours["Cantebury Tactix"] = "#D11919"; TeamColours["Central Pulse"] = "#FFFF47";
	TeamColours["Northern Mystics"] = "#476CDA"; TeamColours["Southern Steel"] = "#6CDAFF";
	TeamColours["Waikato Bay of Plenty Magic"] = "#000000"; TeamColours["Adelaide Thunderbirds"] = "#FF4791";
	TeamColours["Melbourne Vixens"] = "#00CC99"; TeamColours["New South Wales Swifts"] = "#FF3300";
	TeamColours["Queensland Firebirds"] = "#853385"; TeamColours["West Coast Fever"] = "#19A347";
	TeamColours["Mainland Tactix"] = "#D11919"; TeamColours["New Zealand"] = "black";
	TeamColours["Australia"] = "yellow";
}

function getTeamColour(name) {
	return TeamColours[name];
}

function getTeamColours(name1, name2) {
	//Get team colours, if colour is not found replace with pink or blue web scheme
	//border colour will also be pink, blue or black depending on what colours are used by others
	var ans = [];
	ans[0] = TeamColours[name1];
	ans[1] = TeamColours[name2];
	if (!ans[0] && !ans[1]) {
		ans[0] = c1;
		ans[1] = c2;
		ans[2] = "black";
	} else if (!ans[0]) {
		ans[0] = c1;
		ans[2] = c2;
	} else if (!ans[1]) {
		ans[1] = c1;
		ans[2] = c2;
	} else {
		if (ans[0] == "#000000" || ans[1] == "#000000") {
			ans[2] = c2;
		} else {
			ans[2] = "black";
		}
	}
	return ans;
}

function loadData() {
	if (done) {
		loadingComplete();
		return;
	}
	//Check for database and load if possible
	//When its done
	loadTeamColours();
	
	//Set up data
	seasons = ["2008-Table1.csv", "2009-Table1.csv", "2010-Table1.csv", "2011-Table1.csv", "2012-Table1.csv", "2013-Table1.csv"];
	
	//Start reading data
	loadDataFile(seasonsLoaded);
}

function loadDataFile(n) {
	if (n < seasonsMax) {
		console.log("Starting data load for: " + seasons[n]);
		readTextFile(seasons[n]);
	} else {
		parseData();
	}
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {	
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
				text[seasonsLoaded] = allText;
				seasonsLoaded++;
				loadDataFile(seasonsLoaded);
				//console.log(file + " loaded."); //Super delayed and in the wrong order, but it works fine
            }
        }
    }
    rawFile.send(null);
}

function dataFailure() {
	console.log("Failed to Load Data.");
	//loadingPanel.firstChild.innerHTML = "Failed to Load Data.";
}

function parseData() {
	//Convert data into SQL database
	//text[0] to < text[seasonsMax]
	console.log("Starting data parse for " + seasonsLoaded + " entries.");
	
	//Create database
	db = new SQL.Database();
	//Setup size
	var create = "CREATE TABLE anz (Season, Round, Date, HomeTeam, AwayTeam, Venue, HomeScore, AwayScore, Winner);";
	var insert = "INSERT INTO anz VALUES (?";
	for (z=1;z<columns;z++) {
		insert+= ",?";
	}
	insert+= ")";
	db.run(create);
	console.log(db);
	
	
	for (i=0; i < text.length; i++) {
		//Get season name from file, using regex for a 20## number. i.e. 2008, 2009, 2010, etc.
		var name = /20[0-9]{2}/.exec(seasons[i]);
		if (!name) { name = "?"; }
		console.log("Season: " + name);
	
		//Split around line breaks
		var split = text[i].split("\n");
		var combine = false;
		
		//Parse columns
		var cols = split[0].split(",");
		if (cols[2] == "Time") {
			combine = true;
		}
		
		
		//Parse data
		for (j=1; j < split.length; j++) {
			if (split[j].length < 5 || split[j].search("BYES") != -1) {
				continue;
			}
			
			//Custom split to seperate the data around commas but ignoring quotations
			var splitData = customSplit(split[j]);
			//console.log("customSplit: " + splitData);
			var record = [];
			var a = 0; var b = 0;
			record[a] = name + ""; a++;    //Season
			record[a] = splitData[b]; //Round
			a++; b++;
			record[a] = splitData[b]; //Date
			b++;
			if (combine) {
				record[a] += " " + splitData[b]; //Time (added to date)
				b++;
			}
			a++;
			record[a] = splitData[b]; //Home Team
			a++; b++;
			//Removes all white space and extra score info
			//e.g. "  30-50 (67-90) "  -> "30-50"
			//Then splits by the non digits ("-" refuses to work for some reason, using regex or not)
			var draw;
			if (splitData[b].search(/draw/i) >= 0) {
				draw = 1;
			}
			var score = splitData[b].replace(/\(([0-9]| |\-)+\)/g, "").replace(/([a-zA-Z ]*)/g, "").split(/[^0-9]/);
			b++;
			record[a] = splitData[b]; //Away Team
			a++; b++;
			record[a] = splitData[b]; //Venue
			a++; b++;
			//Home Score, Away Score, Winner (H or A) and remove previous Score
			record[a] = score[0]; a++; //Home Score
			record[a] = score[1]; a++; //Away Score
			if (draw) {
				record[a] = "D";
				draw = null;
			} else if(Number(score[0]) > Number(score[1])) {
				record[a] = "H";
			} else {
				record[a] = "A";
			} //Winner
			
			//console.log("record: " + record);
			db.run(insert, record);
		}
	}
	//string needs ' ', numbers do not, arrays for IN : ('a','b','c') or (1,2,3)
	//Column names are further up
	//Some examples:
	//var res = db.exec("SELECT * FROM anz;");
	//var res = db.exec("SELECT * FROM anz WHERE Winner='D';");    //Draw
	//var res = db.exec("SELECT * FROM anz WHERE HomeScore > AwayScore;");    //Home team won
	//var res = db.exec("SELECT * FROM anz WHERE HomeTeam='Central Pulse';");   //Home team is Central Pulse
	//var teams = "('Central Pulse', 'Southern Steel')";                         //Home teams are
	//var res = db.exec("SELECT * FROM anz WHERE HomeTeam IN " + teams + ";");   //Central Pulse or Southern Steel
	//console.log(res[0].values);
	//db.close();
	//return;
	loadingComplete();
	//drawPieGraph([50,50,50]);
	//Example draw pie graph
	//drawPieGraph(compareWins(NewZealandTeams, AustraliaTeams));
	//console.log(getDataFromDB("SELECT DISTINCT Season FROM anz;"));
}

function loadingComplete() {
	//loadingPanel.parentNode.removeChild(loadingPanel);
	done = 1;
	loadSeasonList();
	loadSidebar();
}

function loadSeasonList() {
	var data = getDataFromDB("SELECT DISTINCT Season  FROM anz;")
	seasonList = [];
	for (i = 0; i < data.length; i++) {
		seasonList[i] = data[i][0];
	}
	console.log("Seasons: " + seasonList);
}

function getData() {
	if (!db) { return; }
	
	//var state = Call method that has data type variable
	var state = 1;
	var teams = currentTeams();
	var sideBar = currentDataState();
	//var sideBar = ["2008", "NewZealand", "Australia", null];
	var season = sideBar[0];
	var multi = 0;
	if (season.search(",") >= 0) { multi = 1; }
	if (season == "All") { multi = 1; }
	var team1 = teams[0];
	var team2 = teams[1];
	var venue = sideBar[1];
	var dataType = sideBar[2];
	var team1S = team1;
	var team2S = team2;
	
	if (team1 == "NZ") {
		team1S = NZ;
	} else if (team1 == "AUS") {
		team1S = AUS;
	} else if (team1 == "All") {
		team1S = null;
	}
	if (team2 == "NZ") {
		team2S = NZ;
	} else if (team2 == "AUS") {
		team2S = AUS;
	} else if (team2 == "All") {
		team2S = null;
	}
	
	if (venue == "All") {
		venue = null;
	}
	if (season == "All") {
		season = null;
	}
	
	//Request data from db
	var data = buildSqlStringFromOptions(team1S, team2S, season, venue);
	console.log(data);
	if (dataType == "Win/Loss") {
		return wins(team1, team2, data, multi);
	} else if (dataType = "Goals") {
		return goals(team1, team2, data, multi);
	} else {
		console.log("GetData, dataType: " + dataType + " not done yet.");
		return;
	}
	
}

function goals(team1, team2, data, multi) {
	//Calculate goals for team1 using Home from 1st result and Away from 2nd result
	
	//6 and 7
	
	//Multi > 0 == multiple seasons, in which case log score per season
	//instead of per season sub section
	var ses = [];
	var zez = [];
	if (multi) {
		for (i = 0; i < seasonList.length; i++) {
			ses[i] = 0;
			zez[i] = 0;
		}
	}
	var s = [];
	var u = [];
	var g=0;
	s[0] = 0; s[1] = 0; s[2] = 0; s[3] = 0;
	u[0] = 0; u[1] = 0; u[2] = 0; u[3] = 0;
	var t=0;
	var d=0;
	var v = 'H';
	for (i = 0; i < data.length; i++) {
		for (j = 0; j < data[i].values.length; j++) {
		d++;
			var tar = parseInt(data[i].values[j][6]);
			var rat = parseInt(data[i].values[j][7]);
			var zog = data[i].values[j][0];
			if (i == 0) {
				g+= tar;
				t+= rat;
				if (multi) {
					for (h = 0; h < seasonList.length; h++) {
						if (seasonList[h] == zog) {
							ses[h]+= tar;
							zez[h]+= rat;
							break;
						}
					}
				} else {
					if (data[i].values[j][1] <= midSeason) {
						s[0]+= tar;
						u[0]+= rat;
					} else if (data[i].values[j][1] <= lateSeason) {
						s[1]+= tar;
						u[1]+= rat;
					} else if (data[i].values[j][1] <= finals) {
						s[2]+= tar;
						u[2]+= rat;
					} else {
						s[3]+= tar;
						u[3]+= rat;
					}
				}
			} else {
				g+= rat;
				t+= tar;
				if (multi) {
					for (h = 0; h < seasonList.length; h++) {
						if (seasonList[h] == zog) {
							ses[h]+= rat;
							zez[h]+= tar;
							break;
						}
					}
				} else {
					if (data[i].values[j][1] <= midSeason) {
						s[0]+= rat;
						u[0]+= tar;
					} else if (data[i].values[j][1] <= lateSeason) {
						s[1]+= rat;
						u[1]+= tar;
					} else if (data[i].values[j][1] <= finals) {
						s[2]+= rat;
						u[2]+= tar;
					} else {
						s[3]+= rat;
						u[3]+= tar;
					}
				}
			}
		}
	}
	
	var teamName1 = getTeamName(team1);
	var teamName2 = getTeamName(team2);
	var text = teamName1 + " has scored " + g + " goals against " + teamName2 + " and conceded " + t + ". With averages per game of: " + (formatNumber(g/d, 1)) + " and " + (formatNumber(t/d, 1)) + ".";
	console.log(text);
	title = teamName1 + " vs " + teamName2 + title + " \nGoals";
	
	//Return values
	if (multi) {
		if (isPieGraph) {
			drawPieGraph(teamName1, teamName2, g, t, ses, zez, text, seasonList);
		} else {
			drawBarGraph(teamName1, teamName2, g, t, ses, zez, text, seasonList);
		}
	} else {
		if (isPieGraph) {
			drawPieGraph(teamName1, teamName2, g, t, s, u, text, rounds);
		} else {
			drawBarGraph(teamName1, teamName2, g, t, s, u, text, rounds);
		}
	}
	
	var zog = d3.select(".dynTitle").select("p").text(title);
	var hog = d3.select(".graphKey").select("p").text(text);
	//zog.select("p").remove();
	//zog.append("p").text = title;
	console.log(zog.text);
}

function wins(team1, team2, data, multi) {
	//Calculate goals for team1 using Home from 1st result and Away from 2nd result
	
	//Multi > 0 == multiple seasons, in which case log score per season
	//instead of per season sub section
	var ses = [];
	var zez = [];
	if (multi) {
		for (i = 0; i < seasonList.length; i++) {
			ses[i] = 0;
			zez[i] = 0;
		}
	}
	var s = [];
	var u = [];
	var w=0;
	s[0] = 0; s[1] = 0; s[2] = 0; s[3] = 0;
	u[0] = 0; u[1] = 0; u[2] = 0; u[3] = 0;
	var t=0;
	var d=0;
	var v = 'H';
	for (i = 0; i < data.length; i++) {
		for (j = 0; j < data[i].values.length; j++) {
			var zog = data[i].values[j][0];
			if (data[i].values[j][8] == v) {
				w++;
				if (multi) {
					for (h = 0; h < seasonList.length; h++) {
						if (seasonList[h] == zog) {
							ses[h]++;
							break;
						}
					}
				} else {
					if (data[i].values[j][1] <= midSeason) {
						s[0]++;
					} else if (data[i].values[j][1] <= lateSeason) {
						s[1]++;
					} else if (data[i].values[j][1] <= finals) {
						s[2]++;
					} else {
						s[3]++;
					}
				}
			} else {
				if (multi) {
					for (h = 0; h < seasonList.length; h++) {
						if (seasonList[h] == zog) {
							zez[h]++;
							break;
						}
					}	
				} else {
					if (data[i].values[j][1] <= midSeason) {
						u[0]++;
					} else if (data[i].values[j][1] <= lateSeason) {
						u[1]++;
					} else if (data[i].values[j][1] <= finals) {
						u[2]++;
					} else {
						u[3]++;
					}
				}
			}
			t++;
		}
		v = "A";
	}
	
	var teamName1 = getTeamName(team1);
	var teamName2 = getTeamName(team2);
	var text = teamName1 + " has " + w + " victories against " + teamName2 + " and " + (t-w) + " losses. This is a win rate of " + (formatNumber(w/t*100, 2)) + "%."
	console.log(text);
	title = teamName1 + " vs " + teamName2 + title + " \nWins vs Losses.";
	
	//Return values
	if (multi) {
		if (isPieGraph) {
			drawPieGraph(teamName1, teamName2, w, t-w, ses, zez, text, seasonList);
		} else {
			drawBarGraph(teamName1, teamName2, w, t-w, ses, zez, text, seasonList);
		}
	} else {
		if (isPieGraph) {
			drawPieGraph(teamName1, teamName2, w, t-w, s, u, text, rounds);
		} else {
			drawBarGraph(teamName1, teamName2, w, t-w, ses, zez, text, rounds);
		}
	}
	
	var zog = d3.select(".dynTitle").select("p").text(title);
	var hog = d3.select(".graphKey").select("p").text(text);
	//zog.select("p").remove();
	//zog.append("p").text = title;
	
	console.log(zog.text);
	
	//function drawPieGraph(team1, team2, value1, value2, array1, array2, text) {
	
	return [teamName1, w, t-w];		
}

function placing(data) {
	var dict = {};
	for (j = 0; j < data.length; j++) {
		for (i = 0; i < data[j].length; i++) {
			if (!dict[data[3]]) {
				//Create new entry
				//dict[data[3]] = 
				
				
			}
			
		}
	}
}

function points(data) {
	
}

function streak(data) {

}

function getDataFromDB(txt) {
	if (!done) { console.log("database is not loaded"); return; }
	
	return db.exec(txt)[0].values;
}

function printDataFromDB(txt) {
	if (!done) { console.log("database is not loaded"); return; }
	
	var res = db.exec(txt);
	console.log(res[0].values);
}

function closeDB() {
	if (db) { db.close(); }
}

function customSplit(text) {
	//Split around ',' but not inside quotes
	var ans = [];
	var i=1;
	var last=0;
	var count=0;
	var quotes;
	var end = 0;
	while (i < text.length) {
		if (text[i] == "," && !quotes) {
			end = i;
			if (text[i-1] == "\"") { end--; }
			ans[count] = text.substring(last, end);
			count++;
			last = i+1;
		}
		if (text[i] == "\"") {
			if (quotes) {
				quotes = null;
			} else {
				quotes = 1;
				last++;
			}
		}
		i++;
	}
	if (end < text.length-1) {
		end = text.length;
		if (text[text.length-1] == "\"") {
			end--;
		}
		ans[count] = text.substring(last, end);
	}
	return ans;
}



function buildSqlStringFromOptions(team1, team2, season, venue) {
	//##### Needs to be changed so this method can access some public variables that have
	//all the states of the side bar stored, and then build the string based on those
	//values, then this method can be called without parameters ########

	//Could probably do dynamic title here as well
	var string = "SELECT * FROM anz WHERE";
	//var text1 = "Showing: " + team1 + " vs " + team2;
	var text = "";
	var home = 0;
	
	//Season
	if (season != null) {
		if (season.search(",") >= 0) {
			string += " Season IN " + season;
			var zz = string.split(",");
			text+= " in"
			for (z = 0; z < zz.length; z++) {
				if (z > 1 && z+1 == zz.length) {
					text += " and " + zz[z];
				} else if (z == 0) {
					text += " zz[z]";
				} else {
					text += ", zz[z]";
				}
			}
			
		} else {
			string += " Season = " + "'" + season + "'";
			text += " in " + season;
		}
		string += " AND";
	} else {
		text += " in all seasons"
	}
	
	//Venue
	text += ", playing at";
	if (venue != null) {
		if (venue == "Home") {
			home = 1;
			text += " home venues.";
		} else if (venue == "Away") {
			home = -1;
			text += " away venues.";
		} else {
			string += " Venue = '" + venue + "' AND";
			text += " " + venue;
		}
	} else {
		text += " all venues.";
	}
	
	if (team1.search(",") >= 0) {
		team1 = " IN " + team1;
	} else {
		team1 = " = " + "'" + team1 + "'";
	}
	if (team2.search(",") >= 0) {
		team2 = " IN " + team2;
	} else {
		team2 = " = " + "'" + team2 + "'";
	}
	
	//Matches are seperated by Home and Away and are always sorted by team1	
	var s1, s2;
	if (home != -1) {
		s1 = string + " HomeTeam" + team1 + " AND AwayTeam" + team2 + " ORDER BY HomeTeam ASC;";
	}
	if (home != 1) {
		s2 = string + " HomeTeam" + team2 + " AND AwayTeam" + team1 + " ORDER BY AwayTeam ASC;";
	}
	if (s1 != null && s2 != null) {
		string = s1 + s2;
	} else if (s1 == null) {
		string = s2;
	} else {
		string = s1;
	}
	//string = s1 + s2;
	console.log(string);
	
	//d3.select(".dynTitle").text = text;
	title = text;
	
	return db.exec(string);
}

function compareWins(team1, team2, season, venue) {
	//Display teams1 wins and losses versus team2
	if (db) {
		var res = buildSqlStringFromOptions(team1, team2, season, venue);
		console.log(res);
		
		//Calculate goals for team1 using Home from 1st result and Away from 2nd result
		var w=0;
		var t=0;
		var d=0;
		var v = 'H';
		for (i = 0; i < res.length; i++) {
			for (j = 0; j < res[i].values.length; j++) {
				if (res[i].values[j][8] == v) {
					w++;
				}
				t++;
			}
			v = "A";
		}
		
		var teamName1 = getTeamName(team1);
		var teamName2 = getTeamName(team2);
		console.log(teamName1 + " has " + w + " victories against " + teamName2 + " and " + (t-w) + " losses. This is a win rate of " + (formatNumber(w/t*100, 2)) + "%.");
		//Return values
		return [teamName1, w, t-w];		
	} else {
		console.log("db is not loaded.");
	}
}

function getTeamName(team) {
	var name;
	console.log("GetTeamName: " + team);
	if (team == "NZ") { name = "New Zealand"; }
	else if (team == "AUS") { name = "Australia"; }
	else if (team == "All") { name = "All"; }
	else { return team; }
	return name;
}

function formatNumber(num, dp) {
	return parseFloat(Math.round(num * 100) / 100).toFixed(dp);
}


 
