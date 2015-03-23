// Here's the reference solution:

  var concat=require('concat-stream')
  
  process.stdin.pipe(concat(function (src) {
      Array.prototype.reverse.call(src);
      process.stdout.write(src);
  }));