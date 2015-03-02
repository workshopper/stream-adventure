// Here's the reference solution:

  var ws = require('websocket-stream');
  var stream = ws('ws://localhost:8099');
  stream.write('hello\n');
