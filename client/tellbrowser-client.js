var TellBrowser = function (baseUrl, options) {
  if (!options) {
    options = {};
  }

  baseUrl = baseUrl.replace(/\/+$/, '')

  var cookieName = 'TellBrowserKey';

  var key = options.key;
  if (!key) {
    key = Cookies.get(cookieName);
    if (!key) {
      key = TellBrowser.randomKey();
      Cookies.set(cookieName, key);
    }
  }

  this.listen = function (callback) {
    var socket = io.connect(baseUrl + '/socketio', {'force new connection': true});
    socket.on('connect', function () {
      socket.emit('listen', key);
    });
    socket.on('msg', function (msg, key) {
      callback(msg, key);
    });
  };

  this.send = function (msg) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", baseUrl + "/keys/" + key, true);
    xhr.send(JSON.stringify(msg));
  };
};

TellBrowser.randomKey = function () {
  return uuid.v4();
};
