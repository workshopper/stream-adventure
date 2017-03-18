// Here's the reference solution:

  var trumpet = require('trumpet');
  var through = require('through2');
  var tr = trumpet();
  
  var loud = tr.select('.loud').createStream();
  loud.pipe(through(function (buf, _, next) {
      this.push(buf.toString().toUpperCase());
      next();
  })).pipe(loud);
  
  process.stdin.pipe(tr).pipe(process.stdout);
