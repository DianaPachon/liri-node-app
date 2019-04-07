//variable (dotenv package)
require("dotenv").config();
//Node pacckage reading and writing
var keys = require("./keys");

var axios = require("axios");
var moment = require("moment");
//Spotify call
var Spotify = require('node-spotify-api');

var fs =require("fs");
var spotify = new Spotify(keys.spotify);


var input =process.argv;

var operation =process.input[2];
var choise = process.argv;
var nameSearch ="";

// loop (get more than word)

for (var i =3; i< choise.length; i++){
    if(i>3&& i<choise.length) {
        nameSearch =nameSearch + "+" + choise[i];
    }
else{
    nameSearch += choise[i];
}
}

if(operation === "do-what-it-says"){
    readTextFile();
}
else{
    readUserInput();
}

function readUserInput() {
    if (userCommand === "concert-this") {
      searchBand(nameSearch);
  
    } else if (operation === "spotify-this") {
        //Call the function to search songs with Spotify
        //If no song entered, search the song "The Sign"
        if (!nameSearch) {
            searchSong("The Night We Met");
        } else {
            searchSong(nameSearch);
        }
  
    } else if (operation === "movie-this") {
      //Call the function to search movie info with OMDB API
      //If no movie entered, search Mr.Nobody
      if (!nameSearch) {
        searchMovie("Amélie")
      } else {
        searchMovie(nameSearch);
      }
    }
  } 
  
//concert-this
//spotify-this-song
function searchBand(string) {
    axios.get(`https://rest.bandsintown.com/artists/${string}/events?app_id=codingbootcamp`).then(
      function(response) {
        console.log("==============================================");
        console.log("");
        for (var i=0; i<5;i++){
          console.log("Name: " + response.data[i].venue.name);
          console.log("location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);
          console.log("Event Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
          console.log("");
        }
        console.log("==============================================");
      }
    )
  };

function searchSong(param) {
    spotify.search({ type: 'track', query: param }, function(err, data) {
      if (err) {
        console.log('Error occurred: ' + err);
        return;
      }
      console.log("==============================================");
      console.log("");
      var songs = data.tracks.items;
      for (var i=0; i<songs.length;i++){
        console.log("Artist: " + songs[i].artists.map(getArtistsNames));
        console.log("Song: " + songs[i].name);
        console.log("Album: " + songs[i].album.name);
        console.log("Preview link: " + songs[i].preview_url);

        console.log("");
      } 
      console.log("==============================================");  
    });
  }
  function getArtistsNames(artist) {
    return artist.name;
  }

  function searchMovie(string) {
    axios.get(`http://www.omdbapi.com/?t=${string}&y=&plot=short&apikey=trilogy`).then(
      function(response) {
        console.log("==============================================");
        console.log("");
        console.log("Movie Title: " + response.data.Title);
        console.log("Year t: " + response.data.Year);
        console.log("Country : " + response.data.Country);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
        console.log("Language : " + response.data.Language);
        console.log("IMDB rating : " + response.data.Ratings[0].Value);
        console.log("Rotten Tomatoes rating : " + response.data.Ratings[1].Value);
        console.log("");
        console.log("==============================================");
      }
    )
  };
  
  function readTextFile () {
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }
      var dataArr = data.split(",");
      console.log(dataArr);
  
      userCommand = dataArr[0];
      nameToSearch = dataArr[1];
      readUserInput();

    })
  }
//movie-this
//do-what-it-say