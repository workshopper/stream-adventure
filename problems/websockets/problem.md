In this adventure, write a websocket client that uses the websocket-stream
module, send a message and pipe the stream to `process.stdout`.

To open a stream with websocket-stream on localhost:8099, just write:

```js
var ws = require('websocket-stream');
var stream = ws('ws://localhost:8099');
```

Then write the string "hello\n" to the stream.

The readme for websocket-stream has more info if you're curious about how to
write the server side code: https://github.com/maxogden/websocket-stream

Make sure to `npm install websocket-stream` in the directory where your solution
file lives.
