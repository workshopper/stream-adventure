// Here's the reference solution:

  var ws = require('websocket-stream');
  //if you do this exercise in c9.io, stop apache2, and your web socket server
  //will listen at process.env.PORT, normally is 8080.
  var wss = ws('ws://' + window.location.hostname + ':' + window.location.port);
  stream.write('hello\n');
