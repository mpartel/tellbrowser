
# TellBrowser #

A stupidly simple [nodejs](http://nodejs.org/) + [socket.io](http://socket.io/)
pub/sub for sending asynchronous notifications from your server to the user.

It's not production-grade, but may be useful for prototypes, demos etc.
I've used it as a mock e-mail and text message backend.

## How it works ##

1. The user generates a random cookie named `TellBrowserKey` and subs to a channel with that name.
2. The cookie gets sent with subsequent requests.
3. The server can store the cookie and POST to it to notify the user after a background operation completes.

The primary limitation is that if the user happens to be in the middle of a page load while
the notification is fired then the notification is lost.
Fortunately single-page apps don't suffer from this problem as much.
A better implementation might store the messages for a few minutes or until the user has explicitly acknowledged them.

## How to use ##

1. Copy `config.example.json` to `config.json` and edit if necessary.
2. Run `npm install` and `bower install` to download dependencies.
3. Run `grunt` to build.
4. Start with `node app.js`.

Currently the app can only be run as a single instance.

### Client ###

Include the following scripts.

    <script src="http://localhost:4000/socket.io/socket.io.js"></script>
    <script src="http://localhost:4000/lib/tellbrowser-client.min.js"></script>

Here's a usage example using [notifyjs](http://notifyjs.com/):

    <!-- The following libs are indeed served by the app for maximal convenience. -->
    <link href="http://localhost:4000/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <script src="http://localhost:4000/lib/jquery/jquery.min.js"></script>
    <script src="http://localhost:4000/lib/notifyjs/notify-combined.min.js"></script>

    <script>
        window.addEventListener('load', function () {
            var client = new TellBrowser('http://localhost:4000/');

            client.listen(function (msg) {
                // We're assuming the server sends simple strings.
                $.notify(msg, {
                    autoHide: false,
                    className: 'info'
                });
            });
    </script>

### Server ###

Just send a POST request to `http://localhost:4000/tellbrowser/<key>` where
`<key>` is the value of the `TellBrowserKey` cookie. The body of the request
can be any JSON object.
