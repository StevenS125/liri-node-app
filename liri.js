//include te packages that will be used
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
const imdb = require('imdb-api');
var fs = require('fs');
var keys = require('./keys.js');
// var moment = require('moment');
var controlWord;

// //global control for logging
// var outConsole = true;
// var outFile = true; //the file output function has problems with asyncronous output making the order wrong



if (process.argv.length === 2) {
    //no argv for control word. force switch to default
    controlWord = 'use_default';

} else {
    controlWord = process.argv[2];
}


switch (controlWord) {
    case "my-tweets":
        my_tweets();
        break;

    case "spotify-this-song":
        var songName = "";
        songName = process.argv[3];
        spotify_this_song(songName);
        break;

    case "movie-this":
        var movieName = "";
        movieName = process.argv[3];
        movie_this(movieName);
        break;

    case "do-what-it-says":
        do_what_it_says();
        break;

    default:
        //prompt for correct controlWord
        console.log('Please enter a valid control work as the first argument\nmy-tweets\nspotify-this-song\nmovie-this\ndo-what-it-says');
}

function my_tweets() {
    // Twitter API Credentials
    var client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    // Make call to Twitter API to get user's timeline
    client.get('statuses/user_timeline', { screen_name: 'SteveySnydz' }, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < JSON.stringify(tweets.length); i++) {
                console.log('tweets: ' + JSON.stringify(tweets[i].text, null, 2));
                console.log('time: ' + JSON.stringify(tweets[i].created_at, null, 2), false, true);
            }
        } else {
            console.error('An error occurred!'); //error handling
            console.log('error statusCode = ' + response.statusCode);
        }
    });
}


function spotify_this_song(songName) {
    //check to see if was passed a valid songName
    if (songName === undefined) {
        //force song name if it is not passed
        songName = "what's my age again";
    }
    spotify.search({ type: 'track', query: songName }, function(err, spotifyData) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        if (spotifyData.tracks.items.length === 0) {
            console.log('No data was returned by Spotify -- if the song name is more than one word enclose it in quotes and check the spelling...');
        } else {
            for (var i = 0; i < spotifyData.tracks.items.length; i++) {
                console.log(i + 1);
                console.log('Artist: ' + JSON.stringify(spotifyData.tracks.items[i].artists[0].name, null, 2));
                console.log('Song Name: ' + JSON.stringify(spotifyData.tracks.items[i].name, null, 2));
                console.log('Preview Song: ' + JSON.stringify(spotifyData.tracks.items[i].preview_url, null, 2));
                console.log('Album: ' + JSON.stringify(spotifyData.tracks.items[i].album.name, null, 2));
                console.log("===============================================", false, true);
            }
        }

    });
}


function movie_this(theMovie) {
    //check to see if was passed a valid songName
    if (theMovie === undefined) {
        //force song name if it is not passed
        theMovie = "Mr. Nobody";
    }
    request('http://www.omdbapi.com/?t=' + theMovie + '&y=&tomatoes=true&plot=short&r=json', function(error, response, movieData) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(movieData);
            //console.log("movieData = "+movieData)
            console.log("Title: " + data.Title);
            console.log("Year: " + data.Year, true);
            console.log("Rated: " + data.Rated, true);
            console.log("IMDB Rating: " + data.imdbRating, true);
            console.log("Country: " + data.Country, true);
            console.log("Language: " + data.Language, true);
            console.log("Plot: " + data.Plot, true);
            console.log("Actors: " + data.Actors, true);
            console.log("Rotten Tomatoes Rating: " + data.tomatoUserRating, true);
            console.log("Rotten Tomatoes URL: " + data.tomatoURL, true);
        }
    })
}

function do_what_it_says() {
    fs.readFile("random.txt", "utf8", function(error, fileData) {
        // Then split it by commas (to make it more readable)
        var dataArr = fileData.split(',');
        var controlWord = dataArr[0];
        switch (controlWord) {
            case "my-tweets":
                my_tweets();
                break;

            case "spotify-this-song":
                var songName = "";
                songName = dataArr[1];
                spotify_this_song(songName);
                break;

            case "movie-this":
                var movieName = "";
                movieName = dataArr[1];
                movie_this(movieName);
                break;

            default:
                //when in doubt halt and self destruct
                console.log("the do-what-it-says function does not have adequate information to proceed");
                //format c:
        }
    });
}


