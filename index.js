//jshint esversion:6

// const express = require("express");
// const bodyParser = require("body-parser");
// const request = require("request");
//
// const app = express();
//
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(express.static("public"));
//
// app.get("/", function(req, res) {
//   res.sendFile(__dirname + "/index.html");
// });
// app.listen(3000, function() {
//   console.log("Server is running on port 3000");
// });
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var querystring = require('querystring');

var apiKey = 'NTY1NmMxYWQtNWMzOC00OGI0LTliYzMtZmYxYzQ2YWY2ZTZl';
var apiSecret = 'YTJhNjIyMTItN2MwYy00MjZlLWJkYWEtNDY2MWUyMmZjNWMy';

var port = 2000;
var baseUrl = 'http://localhost:' + port;
var redirectUri = baseUrl + '/authorize';

var app = express();
app.use(express.static("public"));
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/../'));
app.use(bodyParser.json());

app.get('/', function(request, response) {
  var path = 'https://api.rhapsody.com/oauth/authorize?' + querystring.stringify({
    response_type: 'code',
    client_id: apiKey,
    redirect_uri: redirectUri
  });

  response.redirect(path);
});

app.get('/authorize', function(clientRequest, clientResponse) {
  request.post({
    url: 'https://api.rhapsody.com/oauth/access_token',
    form: {
      client_id: apiKey,
      client_secret: apiSecret,
      response_type: 'code',
      code: clientRequest.query.code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }
  }, function(error, response, body) {
    body = JSON.parse(body);
    clientResponse.redirect(baseUrl + '/client.html?' + querystring.stringify({
      accessToken: body.access_token,
      refreshToken: body.refresh_token
    }));
  });
});

app.get('/reauthorize', function(clientRequest, clientResponse) {
  var refreshToken = request.query.refreshToken;

  if (!refreshToken) {
    clientResponse.json(400, { error: 'A refresh token is required.'});
    return;
  }

  request.post({
    url: 'https://api.rhapsody.com/oauth/access_token',
    form: {
      client_id: apiKey,
      client_secret: apiSecret,
      response_type: 'code',
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }
  }, function(error, response, body) {
    console.log('Platform response:', {
      error: error,
      statusCode: response.statusCode,
      body: body
    });

    if (response.statusCode !== 200) {
      clientResponse.json(response.statusCode, { error: error || body });
      return;
    }

    clientResponse.json(200, JSON.parse(body));
  });
});

app.listen(port, function() {
  console.log('Listening on', port);
});
