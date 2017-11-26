/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
// var jsdom = require('jQuery');
// var jsdom = require("jsdom");
// var window = jsdom.jsdom().parentWindow;
//
// jsdom.jQueryify(window, "http://code.jquery.com/jquery-2.1.3.min.js", function () {
//   var $ = window.$;
//   $("body").prepend("<h1>The title</h1>");
//   console.log($("h1").html());
// });

var request = require('request');
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '77bf21dac1cf45aebb8f17885de01bbe'; // Your client id
var client_secret = '97fafd1d3bab46cca49e1a6551626715'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

var headers = {
  'Authorization': 'Bearer BQCMeQo91Uk6bP94v0CZSpqEBrU5J3j3Qxt1W_PC7q5KX4o90Ymw9rSEqa4MOtppRX9A_6EpEwOrPKGIN_oF-bunWG6aFtoHfIzEmW-_27pZF2m7hSIFvx_6mdPOIRf4hfWHsmhOOf_7GDDXTmRkFgLHcyvCo6OamVlPZA1j4xeTUM4zSV1b0pGUuAJnHjx2_KYo-EHvl1a9erhAOesbMFjerRqCPZ5AvAZySJ3nmU4YLiuCOWSnWLqptKReOuAd4YZ0h8KiM8CT',
  "Content-Type" : "application/json"
}

var playlistIDs = [];

var currentPlaylist = 1;
var lastPlaylist = 0;
var currentVolume = 100;
var lastVolume = 100;

// Configure the request
var optionsPlaylists = {
    url: 'https://api.spotify.com/v1/users/12147083538/playlists',
    method: 'GET',
    headers: headers
}


var positionBody = JSON.stringify({
  position: 1
});

var myArray = {
  "1": "Release Radar",
  "2": "Discover Weekly",
  "3": "Today's Top Hits",
  "4": "New Music Friday",
};

var arrayId = 2;
var someOtherValue = 10;

function callSpotify(error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        //console.log(body)
        //console.log("Here I start");
        //console.log(arrayId);
        var response = JSON.parse(body);
        for (i = 0; i < response.items.length; i++ ) {
          // console.log(myArray);
          if (response.items[i].name === myArray[arrayId]) {
            var playlist = response.items[i];

            var obj = { "context_uri":"spotify:user:spotify:playlist:" + playlist.id,
            "offset": {"position": someOtherValue}};
            var putBody = JSON.stringify(obj);

            console.log(playlist.name);

            var optionsJustOnePlaylist = {
                url: 'https://api.spotify.com/v1/me/player/play',
                method: 'PUT',
                headers: headers,
                qs: {'device_id	': '77836aa34cdbeded0dda36fa47248f077833fc4b'}
            }

            request(optionsJustOnePlaylist, function(error, response, body) {
              //console.log("success");
              console.log(putBody);
            }).end(putBody);

          
          }
        }
    }
}
// Start the request
//request(optionsPlaylists, callSpotify);

//-------------------------------------------------------------------------
//-------------------------------------------------------------------------


var SerialPort = require('serialport');

  var port = new SerialPort('/dev/cu.usbmodem2462301', {
    baudRate: 57600
  });

  port.on('open', () => {
    console.log('Port Opened');
    //request(options, callSpotify);
  });


  var playlists = 4;

/////

  // require('./car.js').getPlaylists('hello');

  port.on('data', (data) => {
    /* get a buffer of data from the serial port */
    //console.log(data.toString());

    if((data.toString() >= 0) && (data.toString()<=1000)){
      currentPlaylist = data.toString();
      currentPlaylist = parseInt(((currentPlaylist - 0) / (1000 - 0) * (playlists + 1 - 1) + 1));
      //getPlaylists(currentPlaylist);
    } else if ((data.toString()>=1001) && (data.toString()<=2000)) {
      currentVolume = data.toString();
      currentVolume = parseInt((currentVolume-1000)/10);
    } else {
      console.log('unknown serial O.o :: ' + data.toString());
    }

    // console.log('Playlist: ', currentPlaylist);
    // console.log('Volume: ', currentVolume);

    if(lastPlaylist != currentPlaylist){
    
    //console.log(playlistIDs[currentPlaylist - 1]);
    //console.log("am I running?");

    request(optionsPlaylists, callSpotify);
    arrayId = currentPlaylist;
    someOtherValue = parseInt(Math.random() * 30);
   //console.log('someother: ' + someOtherValue);
    lastPlaylist = currentPlaylist;
    } else {
      //chill :)
    }

    if(Math.abs(lastVolume - currentVolume)>5){
      //change the volume of the app to the current volume :)

    // Configure the request
    var volumePlay = {
      url: 'https://api.spotify.com/v1/me/player/volume',
      method: 'PUT',
      headers: headers,
      qs: {'device_id	': '77836aa34cdbeded0dda36fa47248f077833fc4b', 'volume_percent' : currentVolume}
    }

    request(volumePlay, function(error, response, body) {
      //console.log("success");
      //console.log(body);

    }).end();

      lastVolume = currentVolume;

      console.log("Volume changed to: " + currentVolume);
    } else {
      //chill :P
    }

  });


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


/*
var stateKey = 'spotify_auth_state';


var app = express();



app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
*/
