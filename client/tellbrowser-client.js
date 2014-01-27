var TellBrowser = function (baseUrl, options) {
  if (!options) {
    options = {};
  }

  var queueUrl = baseUrl + '/socketio';
  var cookieName = 'TellBrowserKey';

  var key = options.key;
  if (!key) {
    key = Cookies.get(cookieName);
    if (!key) {
      key = TellBrowser.randomKey();
      Cookies.set(cookieName, key, {
        expires: 365 * 24 * 60 * 60
      });
    }
  }

  this.listen = function (callback) {
    var socket = io.connect(queueUrl, {'force new connection': true});
    socket.on('connect', function () {
      socket.emit('listen', key);
    });
    socket.on('msg', function (msg, key) {
      callback(msg, key);
    });
  };

  this.send = function (msg) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", baseUrl + "/" + key, true);
    xhr.send(JSON.stringify(msg));
  };
};

TellBrowser.randomKey = function () {
  return uuid.v4();
};
