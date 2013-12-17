var request = require('request');
var r = request.post('http://localhost:8000');
process.stdin.pipe(r).pipe(process.stdout);
