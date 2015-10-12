
$(document).ready(function(){
	
	//local vars, object vars, eventlisteners, event triggers chris order(ajax = triggerer).
	
	function RiotProjectPage(){
		
	
		document.getElementById("BackgroundMusic").controls = false;
		
		//.bind to bind object back to itself
		
		$("#summonerNameForm").on("submit", this.onsummonerNameFormSubmit.bind(this));
		$("#storyProgressionButton").on("click", this.onStoryProgressionStart.bind(this));
		$("#userSoundControl").on("click", this.onUserRequestSoundControl.bind(this));
		$("#endOfStoryButton").on("click", this.onUserEndStoryRequest.bind(this));
		
	} 
	

	RiotProjectPage.prototype.onsummonerNameFormSubmit = function(e){
	
		// preventDefault: prevents browsers default behavior for events.
		if(document.getElementById("region").value === "na")
		{
			var url = 'http://www.gloriousgale.com/riotapi6.php';
			
		}
		
		else if(document.getElementById("region").value === "euw")
		{
			var url = 'http://www.gloriousgale.com/euwriotapi6.php';
		}
		e.preventDefault();

		document.getElementById('summonerNameFormClickSound').volume = 0.06;
		document.getElementById("summonerNameFormClickSound").play();


		var summonerName = $("#summonerName").val().toLowerCase().trim();

		//going through site to add summoner name to url while keeping key hidden
		

		//this replaces global, but confines it in object
	
		this.summonerName = summonerName;
		

		$.getJSON(url, {
			//property:value
			
			summonerName:summonerName

		}, this.onSummonerInfoRequest.bind(this))


	}

	
	RiotProjectPage.prototype.onSummonerInfoRequest = function(json){
		var summonerData = json;
		var summonerName = this.summonerName;
		var summonerId = summonerData[summonerName].id;
		if(document.getElementById("region").value === "na")
		{
			var summonerRecentGame = 'http://www.gloriousgale.com/riotapi.php';
		}
		else if (document.getElementById("region").value === "euw")
		{
			var summonerRecentGame = 'http://www.gloriousgale.com/euwriotapi.php';
		}
		this.summonerId = summonerId;
		
		$.getJSON(summonerRecentGame, {
			summonerID:summonerId
		}, this.onSummonerRecentGameInfoRequest.bind(this))


	}

	RiotProjectPage.prototype.onSummonerRecentGameInfoRequest = function(json){
		
		if(document.getElementById("region").value === "na")
		{
			var url = "http://www.gloriousgale.com/riotapi2.php";
		}
		else if(document.getElementById("region").value === "euw")
		{
			var url = "http://www.gloriousgale.com/euwriotapi2.php";
		}
		//when if should, for thinking about code
		//when = listeners, if = if statements, should = explaintion.
		//this is for when you need stats on whats happening in game.

		var gameStatistics = json.games[0];
		var championId = json.games[0].championId;
		var teammateInformation = [];
		var teamId = json.games[0].teamId;


		var storyTracker = 0;
		var championCounter = 0;
		
		var obj = new Object();

		
		var championList = [];
		var summonerGameId = json.games[0].gameId;
		var gameStatistics = json.games[0].stats;

		
		if(gameStatistics.championKills = undefined)
		{
			gameStatistics.championsKilled = 0;
		}

		if(gameStatistics.numDeaths > 0)
		{
			var KDA = (gameStatistics.assists + gameStatistics.championsKilled)/gameStatistics.numDeaths;
		}
		else if(gameStatistics.numDeaths === 0)
		{
			var KDA = (gameStatistics.assists + gameStatistics.championsKilled)/1;
		}		
	
		

		this.championCounter = championCounter;
		this.championList = championList;
		this.championId = championId;
		this.summonerGameId = summonerGameId;
		this.gameStatistics = gameStatistics;
		this.teamId = teamId;
		this.storyTracker = storyTracker;
		this.KDA =  KDA;


		obj.idsForTeamChampions = this.championId;
		obj.teammateIds = this.summonerId;
		obj.teamBlueOrRed = this.teamId;
		
		

		document.getElementById("bootstrapHeader").style.visibility = "hidden";
		document.getElementById("options").style.visibility = "visible";
		if(json.games[0].mapId === 11)
		{
			
			teammateInformation = json.games[0].fellowPlayers.map(function (item){
				
				return{
					teamBlueOrRed: item.teamId,
					idsForTeamChampions: item.championId,
					teammateIds: item.summonerId,
					
				}
			}).filter(function (x){
				return typeof x !== 'undefined';
			});

			teammateInformation[9] = teammateInformation[0]
			teammateInformation[0] = obj;
			
			this.teammateInformation = teammateInformation;

		
			$.getJSON(url, {
			},this.onChampionInfoRequest.bind(this))
				
		}
		else
		{
			alert("Big sorry this experience only really works with summoners rift games");
			location.reload();
		}
	}

	RiotProjectPage.prototype.onChampionInfoRequest = function(json){
		
		
		for(var i = 0; i < this.teammateInformation.length; i++){
			for(this.teammateInformation.idsForTeamChampions in json.data)
			{
				if(json.data.hasOwnProperty(this.teammateInformation[i].idsForTeamChampions)){
					
					this.championList[i] = (json.data[this.teammateInformation[i].idsForTeamChampions].key);
					
					}

				 
				}

			}
			
			
			if(i === 10 && document.getElementById("region").value === "na")
			{
				

				$.getJSON('http://www.gloriousgale.com/riotapi3.php',{
					firstMember:this.teammateInformation[0].teammateIds, secondMember:this.teammateInformation[1].teammateIds, thirdMember:this.teammateInformation[2].teammateIds, forthMember:this.teammateInformation[3].teammateIds, fifthMember:this.teammateInformation[4].teammateIds, sixthMember:this.teammateInformation[5].teammateIds, seventhMember:this.teammateInformation[6].teammateIds, eighthMember:this.teammateInformation[7].teammateIds, ninthMember:this.teammateInformation[8].teammateIds, tenthMember:this.teammateInformation[9].teammateIds
					},
					this.onSummonerTeamInfoRequest.bind(this))
			
			return this.championList;
			}
			else if(i === 10 && document.getElementById("region").value === "euw")
			{
			
				$.getJSON('http://www.gloriousgale.com/euwriotapi3.php',{
					firstMember:this.teammateInformation[0].teammateIds, secondMember:this.teammateInformation[1].teammateIds, thirdMember:this.teammateInformation[2].teammateIds, forthMember:this.teammateInformation[3].teammateIds, fifthMember:this.teammateInformation[4].teammateIds, sixthMember:this.teammateInformation[5].teammateIds, seventhMember:this.teammateInformation[6].teammateIds, eighthMember:this.teammateInformation[7].teammateIds, ninthMember:this.teammateInformation[8].teammateIds, tenthMember:this.teammateInformation[9].teammateIds
					},
					this.onSummonerTeamInfoRequest.bind(this))
			
			return this.championList;
			}
		}	
		
	
	RiotProjectPage.prototype.onSummonerTeamInfoRequest = function(json){
	
		var mainsummonerChampion = this.championList[0];
		this.mainsummonerChampion = mainsummonerChampion;
		
		var teammateNames = [];
		
		if(document.getElementById("region").value === "na")
		{
			var url = 'http://www.gloriousgale.com/riotapi4.php'
		}
		else if(document.getElementById("region").value === "euw")
		{
			var url = 'http://www.gloriousgale.com/euwriotapi4.php'
		}
		

		for(var i = 0; i !== this.teammateInformation.length; i++)
			{
				
				teammateNames.push(json[this.teammateInformation[i].teammateIds].name);
				
			}
		

		this.teammateNames = teammateNames;
		$.getJSON(url,{}, this.onGatherChampionDataRequest.bind(this))


	}
	

	
	//this is the code that sets the summoners champion aswell as the background image and other champ related properties
	

	RiotProjectPage.prototype.onGatherChampionDataRequest = function(json){

		this.mainsummonerChampion = this.championList[0];

		//champion set of champions;

		
		var champRowCounter = 0;
		var champRowCounterRed = 0;
			
		var summonerChampNames = [];

		//this gets the summoner champions and puts them into a table by appending them and gets their images from the data dragon site.s
		for(var i = 0; i <= 9; i++)
		{
			
			summonerChampNames.push(this.championList[i]);
			
			//gonna swap the span for tds that will hold the other stats for this crappy thing XDDDDDDD R_R
			if(this.teammateInformation[i].teamBlueOrRed === 100)
			{
				
				$('#summonerTable1 > tbody:last-child').append('<tr><td><img class="teamPngs" src='+"http://ddragon.leagueoflegends.com/cdn/5.13.1/img/champion/{champImg}.png".assign({champImg:this.championList[i]}) +'><br />'+this.championList[i]+'</td><td><span>'+  this.teammateNames[i] + '</span><td><span  id='+"teamNum{iNum}".assign({iNum:champRowCounter}) +'> |K/D/A|<br /></span> <td> <span id='+"teamKDA{iNum}".assign({iNum:champRowCounter})+'> Total KDA|<br /></span><td><span id='+"teamCS{iNum}".assign({iNum:champRowCounter})+'>Creep Score| <br /></span></td></td></td></td></tr>');
				champRowCounter++;
			}
			else
			{
				
				$('#summonerTable2 > tbody:last-child').append('<tr><td><img class="teamPngs" src='+"http://ddragon.leagueoflegends.com/cdn/5.13.1/img/champion/{champImg}.png".assign({champImg:this.championList[i]}) +'><br />' + this.championList[i]+ '</td><td><span>' +  this.teammateNames[i] + '</span><td><span  id='+"teamNum{iNum}".assign({iNum:champRowCounter}) +'> |K/D/A|<br /></span> <td> <span id='+"teamKDA{iNum}".assign({iNum:champRowCounter})+'> Total KDA|<br /></span><td><span id='+"teamCS{iNum}".assign({iNum:champRowCounter})+'>Creep Score| <br /></span></td></td></td></td></tr>');
				champRowCounter++;
			}
		}

		this.summonerChampNames = summonerChampNames;
		
			if(document.getElementById("region").value === "na")
			{
				var url = "http://www.gloriousgale.com/riotapi5.php"
			}
			else if(document.getElementById("region").value === "euw")
			{
				var url = "http://www.gloriousgale.com/euwriotapi5.php"
			}
		
		var championName = this.mainsummonerChampion;
		var summonerChampionPick;
		
		championName = championName.replace(" ", "");
		var slimBackgroundChampImage = 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/{championName}_0.jpg'.assign({championName:championName});
		var backgroundChampImage = 'http://ddragon.leagueoflegends.com/cdn/img/champion/splash/{championName}_0.jpg'.assign({championName:championName});
		

		
		$(BGIMG).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('blackScreen.jpg')"});

		this.championName = championName;
		this.backgroundChampImage = backgroundChampImage;
		this.slimBackgroundChampImage = slimBackgroundChampImage;


		
		$.getJSON(url,{
			summonerGameId:this.summonerGameId
		}, this.onMatchStatsRequest.bind(this))

	}

	//this function is gonna check the info in game before it passes it to the story function
	RiotProjectPage.prototype.onMatchStatsRequest = function(json){
		matchToGameComparison = json;

		
		var wardPlaced = this.gameStatistics.wardPlaced;

		this.wardPlaced = wardPlaced;
		this.matchToGameComparison = matchToGameComparison;

		
		
		//IF I want to add what team the player was on Ill use this code.
		
	/*	for(var x = 0; x !== this.teammateInformation.length; x++)
		{
			//this is where the stats for the story goes.
			//will take from here and put into divs to make the story


			if(this.teammateInformation[x].teamBlueOrRed === 100){

				
				

				//document.getElementById("summonerNameText").innerHTML = document.getElementById("summonerNameText").innerHTML + this.teammateNames[x] + "<br /> <br />";
			}
			else{
				
				
				//document.getElementById("summonerNameText2").innerHTML = document.getElementById("summonerNameText2").innerHTML + this.teammateNames[x] + "<br /> <br />";
			
			}
		}
*/
	

		//this is for getting the timeline information from matchtogame info
		
		for(var i = 0; i < matchToGameComparison.participants.length; i++)
		{	

			if(this.teammateInformation[0].idsForTeamChampions === this.matchToGameComparison.participants[i].championId && this.gameStatistics.team === this.matchToGameComparison.participants[i].teamId){
				
				var correctMatchTimeLineInfomation = matchToGameComparison.participants[i];
				var summonerLane = correctMatchTimeLineInfomation.timeline.lane;
				
				summonerLane = summonerLane.toLowerCase();
			}


			
		}

		for(var x = 0; x !== matchToGameComparison.participants.length; x++)
		{
			
			
			
			for(var test = 0; test <= 9; test++)
			{
				
				if(this.teammateInformation[test].idsForTeamChampions === matchToGameComparison.participants[x].championId)
				{
					
					document.getElementById('teamNum'+test.toString()).innerHTML = document.getElementById('teamNum'+test.toString()).innerHTML + matchToGameComparison.participants[x].stats.kills +"/"+ matchToGameComparison.participants[x].stats.deaths +"/"+matchToGameComparison.participants[x].stats.assists;
					
					document.getElementById('teamKDA'+test.toString()).innerHTML = document.getElementById('teamKDA'+test.toString()).innerHTML + Math.round((matchToGameComparison.participants[x].stats.kills + matchToGameComparison.participants[x].stats.assists)/matchToGameComparison.participants[x].stats.deaths * 10)/10;
					
					document.getElementById('teamCS'+test.toString()).innerHTML = document.getElementById('teamCS'+test.toString()).innerHTML + matchToGameComparison.participants[x].stats.minionsKilled;
					break;
				}
				
			}

			// else
			// {
			// 	document.getElementById('teamNum1').innerHTML = matchToGameComparison.participants[x].stats.kills;
			// }
		}

		/*this.matchToGameComparison.participants.forEach(function (item)
		{
			console.log(this.teammateInformation[].idsForTeamChampions);
				if(item.championId === this.teammateInformation[4].idsForTeamChampions)
				{
					alert("yes");
				}
		})*/
		this.summonerLane = summonerLane;
		this.correctMatchTimeLineInfomation = correctMatchTimeLineInfomation;

		//makes story button visible
		document.getElementById('storyProgressionButton').style.visibility = "visible";
	

	}


	
	//this function controls the story, it switches between text/images while they are faded
	
	RiotProjectPage.prototype.onStoryProgressionStart = function(){
		

		this.storyTracker++
		window.getComputedStyle(storyTextHolderIntro).opacity;

		

		
		if(this.storyTracker === 1){
			
			


			storyTextHolderIntro.style.opacity = 1;

			document.getElementById('campFireVid').style.visibility = "visible";
			document.getElementById('campFireVid').play();
			document.getElementById('campFireVid').volume = 0.04;
			document.getElementById('BackgroundMusic').loop = true;
			document.getElementById('BackgroundMusic').play();
			document.getElementById('BackgroundMusic').volume = 0.04;
			
			document.getElementById('endOfStoryButton').style.visibility = "visible";
			document.getElementById('userSoundControl').style.visibility = "visible";
			document.getElementById('flashBack2').style.visibility = "visible";
			document.getElementById('flashBack').style.visibility = "visible";
			document.getElementById('flashBackVideos').style.visibility = "visible";

			document.getElementById('BGIMG').style.opacity = 0.7;



			$(BGIMG).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('blackScreen.jpg')"});

			document.getElementById("storyTextIntro").innerHTML = document.getElementById("storyTextIntro").innerHTML + "Well I'll be damned, you're " + this.teammateNames[0] + " the great aren't you?";
			document.body.style.backgroundColor = "transparent";
			
		}
		else if(this.storyTracker === 2){
			storyTextHolderIntro2.style.opacity = 1;

			document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + "You were in that last match on Summoner's Rift, let's see who was the hero you chose to work with that match...<br />";
			
		
			
		}

	

		else if(this.storyTracker === 3){

			//clear old info as the story progresses.
			storyTextHolderIntro.style.opacity = 0;

			storyTextHolderIntro3.style.opacity = 1;
			flashBack.style.opacity = 0.7;
			
			document.getElementById("storyTextIntro3").innerHTML = document.getElementById("storyTextIntro3").innerHTML + "Ahh yes I remember now, you worked with " + this.mainsummonerChampion;
		
			$(flashBack).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('"+ this.slimBackgroundChampImage +"')"});
		}
	


		


		else if(this.storyTracker === 4)
		{
			document.getElementById("storyTextIntro").innerHTML = "";
			
			storyTextHolderIntro2.style.opacity = 0;
			flashBack.style.opacity = 0;


			flashBack2.style.opacity = .7;
			flashBack2.style.top = 280;

			storyTextHolderIntro4.style.opacity = 1;
			
			//this is for the lane that the summoner went to
			document.getElementById("storyTextIntro4").innerHTML = document.getElementById("storyTextIntro4").innerHTML + "Yes, yes, it's all coming back to me now you were in " +	this.summonerLane + " lane if I remember correctly <br /><br />";
			if(this.summonerLane === "bottom")
			{
				$(flashBack2).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('botLanePH.jpg ')"});
			}
			else if(this.summonerLane === "top")
			{
				$(flashBack2).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('topLanePH.jpg ')"});
			}
			else if(this.summonerLane === "middle")
			{
				$(flashBack2).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('midLanePH.jpg ')"});
			}
			else if(this.summonerLane === "jungle")
			{
				$(flashBack2).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('jungleLanePH.jpg ')"});
			}
			document.getElementById("storyTextIntro4").innerHTML = document.getElementById("storyTextIntro4").innerHTML + "Please stay a while and listen... I could use the company";
			
		}
		

		


		else if(this.storyTracker === 5)
		{
			var csPerMin;

			this.csPerMin = csPerMin;

			if(this.matchToGameComparison.matchDuration <= 2000)
			{
				csPerMin = (this.correctMatchTimeLineInfomation.timeline.creepsPerMinDeltas.zeroToTen + this.correctMatchTimeLineInfomation.timeline.creepsPerMinDeltas.tenToTwenty)/2;
			}
			else if (this.matchToGameComparison.matchDuration > 2000 && this.matchToGameComparison.matchDuration <= 3000)
			{
				csPerMin = (this.correctMatchTimeLineInfomation.timeline.creepsPerMinDeltas.zeroToTen + this.correctMatchTimeLineInfomation.timeline.creepsPerMinDeltas.tenToTwenty + this.correctMatchTimeLineInfomation.timeline.creepsPerMinDeltas.twentyToThirty)/3
			}
			else if(this.matchToGameComparison.matchDuration > 3000)
			{
				csPerMin = (this.correctMatchTimeLineInfomation.timeline.creepsPerMinDeltas.zeroToTen + this.correctMatchTimeLineInfomation.timeline.creepsPerMinDeltas.tenToTwenty + this.correctMatchTimeLineInfomation.timeline.creepsPerMinDeltas.twentyToThirty + this.correctMatchTimeLineInfomation.timeline.creepsPerMinDeltas.thirtyToEnd)/4
			};

			this.csPerMin = csPerMin;

			

			storyTextHolderIntro.style.opacity = 1;

			document.getElementById("storyTextIntro2").innerHTML = "";
			
			//these will need to be moved to after they have faded out;
			
			
			storyTextHolderIntro3.style.opacity = 0;
			storyTextHolderIntro4.style.opacity = 0;
			
			
			flashBack2.style.opacity = 0;
			
			
			flashBack.style.opacity = 0.7;
			$(flashBack).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('minionCS.jpg')"});

			if(this.gameStatistics.team == 100)
			{
				var summonerTeam = (this.matchToGameComparison.teams[0])
				
				this.summonerTeam = summonerTeam;

				
				
			}
			else
			{
				
				var summonerTeam = (this.matchToGameComparison.teams[1]);
				this.summonerTeam = summonerTeam;
				
			
			}


			if(csPerMin <= 3)
			{
				
				
				document.getElementById("storyTextIntro").innerHTML = document.getElementById("storyTextIntro").innerHTML + "Ah I remember watching you cs, hmm unless you're are supporting you'll generally want to do better than " + Math.round(csPerMin * 10)/10 + " unless you were supporting that is...";
			}
			
			else if(csPerMin > 3 && csPerMin <= 4)
			{
				
				
				document.getElementById("storyTextIntro").innerHTML = document.getElementById("storyTextIntro").innerHTML + "Ah I remember watching you cs, better than 3 cs per minute but still your csing skills could use a lot of work, " + Math.round( csPerMin * 10)/10 + " could be much higher";
			}
			
			else if(csPerMin > 4 && csPerMin <= 5)
			{
				
				
				document.getElementById("storyTextIntro").innerHTML = document.getElementById("storyTextIntro").innerHTML + "Ah I remember watching you cs, still could use some improvement  " + Math.round(csPerMin * 10)/10 + " definitely needs some work";
			}
			
			else if(csPerMin > 5 && csPerMin <= 6)
			{
				
				
				document.getElementById("storyTextIntro").innerHTML = document.getElementById("storyTextIntro").innerHTML + "Ah I remember watching you cs, from what I recall you had a fairly average creep score of " + Math.round(csPerMin * 10)/10 + ". Which is not bad, but still leaves a lot of room for improvement";
			}

			else if(csPerMin > 6 && csPerMin <= 7)
			{
				
				
				document.getElementById("storyTextIntro").innerHTML = document.getElementById("storyTextIntro").innerHTML + "Ah I remember watching you cs, ah yes you were fairly adept at it from what I remember, you got " + Math.round(csPerMin * 10)/10 + " a minute is pretty good if you ask me";
			}

			else if(csPerMin > 7 && csPerMin <= 8)
			{
	

				document.getElementById("storyTextIntro").innerHTML = document.getElementById("storyTextIntro").innerHTML + "Ah I remember watching you cs, you did a mighty fine job indeed, " + Math.round(csPerMin * 10)/10 + " a minute is extremely solid";
			}

			else if(csPerMin > 8 && csPerMin <= 9)
			{
	
	
				document.getElementById("storyTextIntro").innerHTML = document.getElementById("storyTextIntro").innerHTML + "Ah I remember watching you cs, absolutely INCREDIBLE! " + Math.round(csPerMin * 10)/10 + " a minute is purely outstanding!";
			}

		}

		else if(this.storyTracker === 6)
		{	
			document.getElementById("storyTextIntro3").innerHTML = "";
			document.getElementById("storyTextIntro4").innerHTML = "";

			flashBack.style.opacity = 0;
			
		
			if(this.summonerTeam.firstBlood === true)
			{
				storyTextHolderIntro2.style.opacity = 1;
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + " and lets see From what I remember your team was able to score the firstBlood in that game." + "<br /> " + " Yes yes, But after there was the mighty dra.."
			}
			
			else 
			{
				storyTextHolderIntro2.style.opacity = 1;
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + " unfortunately you're team gave first blood to your adversaries, quite unlucky that was." + " <br /> "+ " Yes yes, but after that there was the mighty dra..."
			}
		
		}

		else if(this.storyTracker === 7)
		{
			storyTextHolderIntro.style.opacity = 0;
			flashBackVideos.style.opacity = .9;
			document.getElementById('dragonVideo').play();
			document.getElementById('dragonVideo').volume = 0;

			document.getElementById('dragonSound').play();
			document.getElementById('dragonSound').volume = 0.2;
			

			$(flashBack2).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('LoLDragon.jpg')"});
		
		}
		

		else if(this.storyTracker === 8)
		{
			storyTextHolderIntro3.style.opacity = 1;

			if(this.summonerTeam.firstDragon === true && this.summonerTeam.firstBlood === true)
			{
				document.getElementById("storyTextIntro3").innerHTML = document.getElementById("storyTextIntro3").innerHTML + " Hmpf, as I was saying the first kill of the mighty dragon went to your team. Guess that first blood really helped with securing this objective." 
			}

			else if(this.summonerTeam.firstDragon === true && this.summonerTeam.firstBlood === false)
			{
				document.getElementById("storyTextIntro3").innerHTML = document.getElementById("storyTextIntro3").innerHTML + " Hmpf, as I was saying the first kill of the mighty dragon went to your team. It's great that your team was able to bounce back from that whole first blood debacle." 
			}

			else if(this.summonerTeam.firstDragon === false && this.summonerTeam.firstBlood === true)
			{
				document.getElementById("storyTextIntro3").innerHTML = document.getElementById("storyTextIntro3").innerHTML + " Hmpf, as I was saying it's a shame your team wasn't able to pick up the first dragon. At least your team was able to snag the first kill in the game." 
			}
			else if(this.summonerTeam.firstDragon === false && this.summonerTeam.firstBlood === false)
			{
				document.getElementById("storyTextIntro3").innerHTML = document.getElementById("storyTextIntro3").innerHTML + " Hmpf, as I was saying, losing first blood and the first Dragon that game was off to a rocky start eh?." 
			}
		}

		else if(this.storyTracker === 9)
		{
			storyTextHolderIntro2.style.opacity = 0;
			storyTextHolderIntro4.style.opacity = 1;

			document.getElementById("storyTextIntro").innerHTML = "";

			if(this.summonerTeam.dragonKills === 0)
			{
				document.getElementById("storyTextIntro4").innerHTML = document.getElementById("storyTextIntro4").innerHTML + "It's a true shame your team couldn't manage to score at least one dragon the might he gives your team is important later in the game."
			}
			else if(this.summonerTeam.dragonKills === 1)
			{
				document.getElementById("storyTextIntro4").innerHTML = document.getElementById("storyTextIntro4").innerHTML + "Your team was able to get the first of the dragon's blessing which is nice at least."
			}
			else if(this.summonerTeam.dragonKills === 2)
			{
				document.getElementById("storyTextIntro4").innerHTML = document.getElementById("storyTextIntro4").innerHTML + "Getting those two dragons must've really helped teams sieging ability."
			}
			else if(this.summonerTeam.dragonKills === 3)
			{
				document.getElementById("storyTextIntro4").innerHTML = document.getElementById("storyTextIntro4").innerHTML + "Your team managed to kill 3 whole dragons this game, bet that bonus movement speed felt nice"
			}
			else if(this.summonerTeam.dragonKills === 4)
			{
				document.getElementById("storyTextIntro4").innerHTML = document.getElementById("storyTextIntro4").innerHTML + "Four dragons so close to five, if only you could've snagged the fifth."
			}
			else if(this.summonerTeam.dragonKills === 5)
			{
				document.getElementById("storyTextIntro4").innerHTML = document.getElementById("storyTextIntro4").innerHTML + "Fifth dragon, not every day you get to see the dragons fifth blessing, but watching a team of <br /> surging champions with dragon flame infused in them charge the enemy nexus is quite a sight to behold"
			}
		}	

		else if(this.storyTracker === 10)
		{
			flashBackVideos.style.opacity = 0;


			storyTextHolderIntro3.style.opacity = 0;
			storyTextHolderIntro4.style.opacity = 0;

			storyTextHolderIntro.style.opacity = 1;
			flashBack.style.opacity = 0.8;

			document.getElementById("storyTextIntro2").innerHTML = "";

			$(flashBack).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('ward.png')"});


			document.getElementById("storyTextIntro").innerHTML = document.getElementById("storyTextIntro").innerHTML + "Hmm now lets see how did the ward support go that game";
		}

		else if(this.storyTracker === 11)
		{
			storyTextHolderIntro2.style.opacity = 1;
			
			document.getElementById("storyTextIntro3").innerHTML = "";
			
			if(this.gameStatistics.wardPlaced - 2 <= 3 && this.gameStatistics.numDeaths <= 4)
			{
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + "Yikes, don't mean to be rude but " + this.gameStatistics.wardPlaced + " is a pretty low amount of wards to have dropped.";
			}
			
			else if(this.gameStatistics.wardPlaced - 2 <= 3 && this.gameStatistics.numDeaths >= 4)
			{
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + "Yikes, don't mean to be rude but " + this.gameStatistics.wardPlaced + " is a pretty low amount of wards to have dropped. <br /> This probably contributed to the " + this.gameStatistics.numDeaths + " deaths you had.";
			}
		

			else if(this.gameStatistics.wardPlaced - 2 >= 4 && this.gameStatistics.wardPlaced - 2 <= 7)
			{
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + "You only dropped a few this game, " + this.gameStatistics.wardPlaced + " could be higher, remember to try and pick up a ward or two if you have enough gold left over to do so.";
			}



			else if(this.gameStatistics.wardPlaced - 2 >= 4 && this.gameStatistics.wardPlaced - 2 <= 7 && this.gameStatistics.numDeaths >= 4)
			{
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + "You only dropped a few last game, " + this.gameStatistics.wardPlaced + " could be higher, remember to try and pick up a ward or two if you have enough gold left over to do so. <br /> Some of your " + this.gameStatistics.numDeaths + " were probably caused from lack of wards";
			}
			
			else if(this.gameStatistics.wardPlaced - 2 >= 6  && this.gameStatistics.wardPlaced - 2 <= 9)
			{
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + "I remember your warding, " + this.gameStatistics.wardPlaced + " is not too shabby, not too shaby at all, but don't forget that you could always ward more.";
			}
			else if(this.gameStatistics.wardPlaced - 2 >= 7  && this.gameStatistics.wardPlaced - 2 <= 10)
			{
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + "You warded pretty well, " + this.gameStatistics.wardPlaced + " is certainly better than most, remember to try to ward key objectives a few minutes before you plan on taking them though.";
			}

			else if(this.gameStatistics.wardPlaced - 2 >= 10  && this.gameStatistics.wardPlaced - 2 <= 13)
			{
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + "Yes, you were the one with outstanding ward management, " + this.gameStatistics.wardPlaced + " thats better than most(for better or worse heh-heh).";
			}

			else if(this.gameStatistics.wardPlaced - 2 > 13)
			{
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + "Excellent you should keep up you're good wording practice " + this.gameStatistics.wardPlaced + " Is great.";
			}

			document.getElementById("storyTextIntro4").innerHTML = "";
		}

		else if(this.storyTracker === 12 && this.gameStatistics.numDeaths < 4)
		{
			storyTextHolderIntro.style.opacity = 0;
			flashBack.style.opacity = 0;

			storyTextHolderIntro3.style.opacity = 1;
			flashBack2.style.opacity = 0.8;


			document.getElementById("storyTextIntro3").innerHTML = document.getElementById("storyTextIntro3").innerHTML + " I highly recommend you attend the lecture from the Wise <a href='https://www.youtube.com/watch?v=hi63v_RnnBs' target='_blank' class='Link' id='crumbzVid'>Prophet Crumbzz</a>, he gives detailed instruction on where to ward for each position and why."
		
			$(flashBack2).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('prophetCrumbz.jpg')"});
		}
		else if(this.storyTracker === 12 && this.gameStatistics.numDeaths >= 4)
		{
			storyTextHolderIntro.style.opacity = 0;
			flashBack.style.opacity = 0;

			storyTextHolderIntro3.style.opacity = 1;
			flashBack2.style.opacity = 0.75;

			document.getElementById("storyTextIntro3").innerHTML = document.getElementById("storyTextIntro3").innerHTML + " I highly recommend you attend the lecture from the Wise <a href='https://www.youtube.com/watch?v=hi63v_RnnBs' target='_blank' id='crumbzVid'>Prophet Crumbzz</a>, he gives detailed instruction on where to ward for each position and why." +
			" As well as the ancient tablet left by the mysterious <a href='https://www.youtube.com/watch?v=Z4cTEpSzZcM' target='_blank' id='gbay99Vid' class='Link'>Gbay</a> explaining just how impactful your deaths truly are."
		
			$(flashBack2).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('prophetCrumbz.jpg')"});
		}

		
		else if(this.storyTracker === 13)
		{
			storyTextHolderIntro2.style.opacity = 0;
		
			flashBack2.style.opacity = 0;

			storyTextHolderIntro4.style.opacity = 1;

			document.getElementById("storyTextIntro").innerHTML = "";

			document.getElementById("storyTextIntro4").innerHTML = document.getElementById("storyTextIntro4").innerHTML + "Years ago when the rift was still young it was not uncommon to see the support buy enough wards to supply an entire team. Now however whether you are the adc or the top you should be buying these wonder items whenever they can!";
		}

		else if(this.storyTracker === 14)
		{
			storyTextHolderIntro4.style.opacity = 0;
			storyTextHolderIntro3.style.opacity = 0;
			flashBack2.style.opacity = 0;

			storyTextHolderIntro.style.opacity = 1;
			flashBack.style.opacity = 1;

			$(flashBack).css({backgroundImage:"linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url('killImg.jpg')"});

			document.getElementById("storyTextIntro2").innerHTML = "";

			document.getElementById("storyTextIntro").innerHTML = document.getElementById("storyTextIntro").innerHTML + "Let me remember your kda now...";

		}

		else if(this.storyTracker === 15)
		{

			
			storyTextHolderIntro.style.opacity = 0;


			storyTextHolderIntro2.style.opacity = 1;

			flashBack.style.opacity = .7;

			
			document.getElementById("storyTextIntro3").innerHTML =  "";
			document.getElementById("storyTextIntro4").innerHTML =  "";


			if(this.KDA <= 0.7){

				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML +  Math.round(this.KDA * 100)/100 + ", ...everyone has had games like these so don't feel discouraged!";
			
			}
			
			else if(this.KDA > 1 && this.KDA <= 2){
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML +  Math.round(this.KDA * 100)/100 + " is pretty solid you managed to help out your team a bit.";

			}

			else if(this.KDA > 2 && this.KDA <= 3){
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + " a " + Math.round(this.KDA * 100)/100 + " KDA, Woah there, thats pretty amazing! ";

			}

			else if(this.KDA > 3 && this.KDA <= 4){
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + "Would you look at that!" + Math.round(this.KDA * 100)/100 + " KDA, You must've been carrying your team pretty hard.";
			}

			else if(this.KDA > 4){

				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + Math.round(this.KDA * 100)/100 + " Thats completely outstanding!";
			
			}

			if(this.wardPlaced < 4){
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + " You still have alot you can improve on though, for example the " + this.wardPlaced + " you dropped could be improved appove significantly!";
			}

			else if(this.wardPlaced > 4 && this.wardPlaced <= 8){
	
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + " You still have alot you can improve on though, you dropped " + this.wardPlaced + " wards this game and I believe you could've dropped a bit more!";

			}



			if(this.csPerMin < 2 && this.csPerMin >= 5)
			{
				document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + " Kills are important but cs is just as if not more so, so don't forget to work on your cs as" + this.csPerMin + " could use some more work.";
			}
			
		}
	
		else if(this.storyTracker === 16)
		{
			this.onTitleRequest();
			storyTextHolderIntro2.style.opacity = 0;
			flashBack.style.opacity = 0;
			
			storyTextHolderIntro.style.opacity = 1;
			sumEndStatsHolder.style.opacity = 1;
			document.getElementById("sumEndStatsHolder").style.visibility = "visible";
 			
 			document.getElementById("storyTextIntro2").innerHTML = "";
			document.getElementById("storyTextIntro").innerHTML =  "";
/*
			document.getElementById("championTableImg").src = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/{champPng}.png".assign({champPng:this.championName});
			document.getElementById("championFluff").innerHTML = document.getElementById("championFluff").innerHTML + this.championName;
			document.getElementById("tableKills").innerHTML = document.getElementById("tableKills").innerHTML + this.gameStatistics.championsKilled + "/" + this.gameStatistics.numDeaths + "/" + this.gameStatistics.assists;
			document.getElementById("tableKDA").innerHTML = document.getElementById("tableKDA").innerHTML + Math.round(this.KDA * 10)/10;
			document.getElementById("tableCS").innerHTML = document.getElementById("tableCS").innerHTML + Math.round(this.csPerMin * 100)/100;
*/
			if(this.matchToGameComparison.teams[0].winner === false)
			{
				$('#summonerTable1 > tbody:last-child').append("<td><span class='winCheck'>DEFEATED!</span></td>");
				$('#summonerTable2 > tbody:last-child').append("<td><span class='winCheck'>VICTOR!</span></td>");
			}
			else if(this.matchToGameComparison.teams[0].winner === true)
			{
				$('#summonerTable1 > tbody:last-child').append("<td><span class='winCheck'>VICTOR!</span></td>");
				$('#summonerTable2 > tbody:last-child').append("<td><span class='winCheck'>DEFEATED!</span></td>");
			}

			document.getElementById("storyTextIntro").innerHTML = document.getElementById("storyTextIntro").innerHTML + " Seems like we're coming to the end of our tale... lets gather all the information we have now.";
		}

		else if(this.storyTracker === 17)
		{
			storyTextHolderIntro2.style.opacity = 1;
			document.getElementById("storyTextIntro2").innerHTML = document.getElementById("storyTextIntro2").innerHTML + "Yes, with your stats you were given the well known title of...";
			
		}
		else if(this.storyTracker === 18)
		{
			document.getElementById("storyTextIntro4").innerHTML = "";

			storyTextHolderIntro3.style.opacity = 1;
			document.getElementById("storyTextIntro3").innerHTML = this.championTitle;
		}

		else if(this.storyTracker === 19)
		{
			storyTextHolderIntro4.style.opacity = 1;

			document.getElementById("storyTextIntro4").innerHTML = document.getElementById("storyTextIntro4").innerHTML + " Yes for now lets bring your story to a close, But before we do. We should take a moment to revisit the permfomances of all those in your game...";
		}
		else if(this.storyTracker === 20)
		{
			
			storyTextHolderIntro.style.opacity = 0;
			storyTextHolderIntro2.style.opacity = 0;
			storyTextHolderIntro3.style.opacity = 0;
			storyTextHolderIntro4.style.opacity = 0;

			document.getElementById("storyTextIntro").innerHTML = "";

			document.getElementById("summonerTable2").style.opacity = 1;
			document.getElementById("summonerTable1").style.opacity = 1;
		
			document.getElementById("summonerTable1").style.visibility = "visible";
			document.getElementById("summonerTable2").style.visibility = "visible";


		}
		
	}

	
	RiotProjectPage.prototype.onTitleRequest = function(){

		var championTitle = " The-";
		var champKills = this.gameStatistics.championsKilled;
		var titleCounter = 0;

	
		if(titleCounter === 0)
		{
			
			if(this.wardPlaced <= 3)
			{
				championTitle = championTitle + "Blind- ";
			}
			else if(this.wardPlaced > 3 && this.wardPlaced <= 6)
			{
				championTitle = championTitle + "The-Near-Sighted-";
			}
			else if(this.wardPlaced > 6 && this.wardPlaced <= 7)
			{
				championTitle = championTitle + "Dark-Map-Holding-";
			}
			else if(this.wardPlaced > 7 && this.wardPlaced <= 8)
			{
				championTitle = championTitle + "Dim-Map-Holding-";
			}
			else if(this.wardPlaced > 8 && this.wardPlaced <= 9)
			{
				championTitle = championTitle + "Map-watching-";
			}
			else if(this.wardPlaced > 9 && this.wardPlaced <= 10)
			{
				championTitle = championTitle + "Map-Scouring-";
			}
			else if(this.wardPlaced > 10)
			{
				championTitle = championTitle + "Bright-Map-Wielding-";
			}
			titleCounter ++;
		}
		
		if (titleCounter === 1)
		{
			
			
			if(this.csPerMin <= 2)
			{
				championTitle = championTitle + "Surveyer-";
			}
			else if(this.csPerMin > 2 && this.csPerMin <= 3)
			{
				championTitle = championTitle + "Gentle-";
			}

			else if (this.csPerMin > 3 && this.csPerMin <= 4)
			{
				championTitle = championTitle + "Forgiving-";
			}
			else if(this.csPerMin > 4 && this.csPerMin <= 5)
			{
				championTitle = championTitle + "Ruthless-";
			}
			else if(this.csPerMin > 5 && this.csPerMin <= 6)
			{
				championTitle = championTitle + "Minion-Cultivating-";
			}
			else if(this.csPerMin > 6 && this.csPerMin <= 7)
			{
				championTitle = championTitle + "Master-Minion-Munching-";
			}
			else if(this.csPerMin <= 8)
			{
				championTitle = championTitle + "Mighty-Master-of-Minions-Murdering-";
			}

			titleCounter ++;	

		}

		if(titleCounter === 2)
		{
			
			if(champKills <= 1)
			{
				championTitle = championTitle + "Pacifist!";
			}
			else if(champKills > 1 && champKills <= 3)
			{
				championTitle = championTitle + "Slacker!";
			}
			else if(champKills > 3 && champKills <= 6)
			{
				championTitle = championTitle + "Destroyer!";
			}
			else if(champKills > 6 && champKills <= 9)
			{
				championTitle = championTitle + "Berserker!";
			}
			else if(champKills > 9 && champKills <= 12)
			{
				championTitle = championTitle + "Terminater!";
			}
			else if(champKills > 12 && champKills <= 15)
			{
				championTitle = championTitle + "Assissinater!";
			}
			else if(champKills > 15)
			{
				championTitle = championTitle + "The Angel of Death!";
			}

			this.championTitle = championTitle;
		}
		
	}

	RiotProjectPage.prototype.onUserRequestSoundControl = function(){

		//code for audio
		var userSoundControl = document.getElementById("BackgroundMusic");

		if(userSoundControl.controls === true)
		{
			userSoundControl.controls = false;

		}
		else {
			userSoundControl.controls = true;
		}
		
	}

	RiotProjectPage.prototype.onUserEndStoryRequest = function(){
		this.storyTracker = 19;
			storyTextHolderIntro.style.opacity = 0;
			storyTextHolderIntro2.style.opacity = 0;
			storyTextHolderIntro3.style.opacity = 0;
			storyTextHolderIntro4.style.opacity = 0;

			document.getElementById("storyTextIntro").innerHTML = "";

			document.getElementById("summonerTable2").style.opacity = 1;
			document.getElementById("summonerTable1").style.opacity = 1;
		
			document.getElementById("summonerTable1").style.visibility = "visible";
			document.getElementById("summonerTable2").style.visibility = "visible";
		
			if(this.matchToGameComparison.teams[0].winner === false)
			{
				$('#summonerTable1 > tbody:last-child').append("<td><span class='winCheck'>BLUE SIDE DEFEATED!</span></td>");
				$('#summonerTable2 > tbody:last-child').append("<td><span class='winCheck'>RED SIDE VICTORIOUS!</span></td>");
			}
			else if(this.matchToGameComparison.teams[0].winner === true)
			{
				$('#summonerTable1 > tbody:last-child').append("<td><span class='winCheck'>BLUE SIDE VICTORIOUS!</span></td>");
				$('#summonerTable2 > tbody:last-child').append("<td><span class='winCheck'>RED SIDE DEFEATED!</span></td>");
			}
		

		
	
	}

	//bootstrap stuff
	//this controls the data toggle functions 
	$(document).ready(function(){
	    $('[data-toggle="tooltip"]').tooltip(); 
	});



	var page = new RiotProjectPage();

})