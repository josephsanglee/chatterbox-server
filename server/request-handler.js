var express = require('express');
var fs = require('fs');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

//initial chatterbox welcome statement!
var initial = {
  results: [{username: 'chatterbot', text: 'Welcome!', roomname: 'lobby'}]
};

var messages;

//create the file initially if it isn't created already
fs.open('./data.json', 'r', function (err, data) {
  if (err) {
    fs.writeFile('./data.json', JSON.stringify(initial), 'utf8', function(err) {
      if (err) { return console.log(err); }
      console.log('success');
    });
    return;
  }

  fs.readFile('./data.json', 'utf8', function(err, data) {
    if (err) { return console.log(err); }
    
    messages = JSON.parse(data);
  });
});




var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 404;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  if (request.url === '/classes/messages') {
    if (request.method === 'GET') {
      statusCode = 200;

    } else if (request.method === 'POST') {
      statusCode = 201;

      request.on('data', function(msg) {
        messages.results.unshift(JSON.parse(msg));
        fs.writeFile('./data.json', JSON.stringify(messages), 'utf8', function(err) {
          if (err) { return console.log(err); }
          console.log('success');
        });
      });

    }
  }

  if (request.method === 'OPTIONS') {
    response.end(defaultCorsHeaders);
    return;
  }

  headers['Content-Type'] = 'json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.



  response.end(JSON.stringify(messages));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

exports.requestHandler = requestHandler;
