// Here's the reference solution:

  var concat = require('concat-stream');
  
  process.stdin.pipe(concat(function (src) {
      var s = src.toString().split('').reverse().join('');
      process.stdout.write(s);
  }));