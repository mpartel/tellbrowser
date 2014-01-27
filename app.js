
var connect = require('connect')
var http = require('http');
var socketio = require('socket.io');
var config = require(__dirname + '/config.json');
var events = require('events');

var maxMsgSize = config.maxMsgSize;
var maxListeners = config.maxListeners; // TODO: use

var log = {
  debug: console.log,
  info: console.log,
  warn: console.warn,
  error: console.error
};

var emitter = new events.EventEmitter();
emitter.setMaxListeners(0);

function respondJson(resp, status, respMsg) {
  resp.setHeader("Content-Type", "application/json");
  resp.setHeader("Access-Control-Allow-Origin", "*");
  resp.writeHead(status);
  resp.end(respMsg);
}

function readUpTo(maxRequestSize, req, resp, callback) {
  var data = '';
  var ok = true;

  req.on('data', function (chunk) {
    if (ok) {
      if (data.length + chunk.length <= maxRequestSize) {
        data += chunk;
      } else {
        ok = false;
      }
    }
  });

  req.on('end', function() {
    if (ok) {
      callback(data, req, resp);
    } else {
      log.info("Too much data received.");
      respondJson(resp, 413, '{"error":"Too much data"}');
    }
  });
}

function parseJsonReq(data, req, resp, callback) {
  var msg;
  try {
    msg = JSON.parse(data);
  } catch (ex) {
    log.info("Non-JSON message received: " + JSON.stringify(data));
    respondJson(resp, 500, JSON.stringify({"error": "Could not parse JSON"}));
  }

  callback(msg, req, resp);
}

function handlePostMsg(key, msg, req, resp) {
  emitter.emit(key, msg);
  log.debug("Successful post to " + key);
  respondJson(resp, 200);
}

var app = connect()
  .use(connect.static('public'))
  .use(function (req, resp) {
    var match = /^\/keys\/(.+)/.exec(req.url)
    if (match && req.method == 'POST') {
      var key = match[1];

      readUpTo(maxMsgSize, req, resp, function (data) {
        parseJsonReq(data, req, resp, function (msg) {
          handlePostMsg(key, msg, req, resp);
        });
      });
    } else {
      resp.setHeader("Content-Type", "text/plain");
      resp.writeHead(404);
      resp.end("Not found");
    }
  });


var server = http.createServer(app);


socketio.listen(server).of('/socketio').on('connection', function (socket) {
  var thisKey = null;
  var thisListener = function (msg) {
    socket.emit('msg', msg, thisKey);
  };

  function clear() {
    if (thisKey) {
      emitter.removeListener(thisKey, thisListener);
    }

    thisKey = null;
  }

  socket.on('listen', function (key) {
    log.debug("Key " + key + " being listened");

    clear();

    thisKey = key;
    emitter.on(key, thisListener);
  });

  socket.on('disconnect', function () {
    clear();
  })
});


server.listen(config.port);
