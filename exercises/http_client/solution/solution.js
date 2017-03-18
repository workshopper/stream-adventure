// Here's the reference solution:

  var request = require('request');
  var r = request.post('http://localhost:8099');
  process.stdin.pipe(r).pipe(process.stdout);
