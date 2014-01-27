
# TellBrowser #

A stupidly simple [nodejs](http://nodejs.org/) + [socket.io](http://socket.io/)
pub/sub for sending asynchronous notifications from your server to the user.

It's not production-grade, but may be useful for prototypes, demos etc.

## How it works ##

1. The user generates a random cookie named `TellbrowserKey` and subs to a channel with that name.
2. The cookie gets sent with subsequent requests.
3. The server can store the cookie and POST to it to notify the user after a background operation completes.

The primary limitation is that if the user happens to be in the middle of a page load while
the notification is fired then the notification is lost.
Fortunately single-page apps don't suffer from this problem as much.
A better implementation might store the messages for a few minutes or until the user has explicitly acknowledged them.
