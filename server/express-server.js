var express = require('express');
var fs = require('fs');
var path = require('path');
var http = require('http');
var app = express();

//redirects the server page to the client page
app.use(express.static( __dirname + '/../client'));

/********************************* FILE SYSTEM CODE *******************************/
// var initial = {
//   results: [{username: 'chatterbot', text: 'Welcome!', roomname: 'lobby', date: new Date()}]
// };

var messages;
//write the initial file if it doesn't exist yet
fs.open('./data.json', 'r', function (err, data) {
  if (err) {
    fs.writeFile('./data.json', JSON.stringify(initial), 'utf8', function(err) {
      if (err) { return console.log(err); }
      console.log('success');
    });
  }

  // fs.readFile('./data.json', 'utf8', function(err, data) {
  //   if (err) { return console.log(err); }
    
  //   messages = JSON.parse(data);
  // });
});
fs.readFile('./data.json', 'utf8', function(err, data) {
  if (err) { return console.log(err); }
  
  messages = JSON.parse(data);
});

/***********************************************************************************/

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

app.get('/classes/messages', function(req, res) {
  res.writeHead(200, defaultCorsHeaders);
  res.end(JSON.stringify(messages));
});

app.post('/classes/messages', function(req, res) {
  res.writeHead(201, defaultCorsHeaders);

  req.on('data', function(msg) { 
    msg = JSON.parse(msg);
    msg.date = new Date();
    messages.results.unshift(msg);
    
    // fs.writeFile('./data.json', JSON.stringify(messages), 'utf8', function(err) {
    //   if (err) { return console.log(err); }
    //   console.log('success');
    // });
  });

  req.on('end', function() {
    fs.writeFile('./data.json', JSON.stringify(messages), 'utf8', function(err) {
      if (err) { return console.log(err); }
      console.log('success');
    });
  });

  res.end(JSON.stringify(messages));
});

app.listen(process.env.PORT, function() {
  console.log('we out here');
});