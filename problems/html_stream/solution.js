var trumpet = require('trumpet');
var through = require('through');
var tr = trumpet();

tr.selectAll('.loud', function (elem) {
  var loud = elem.createStream();
  var th = through(function write(data) {
    this.queue(data.toString().toUpperCase());
  }, 
  function end () {
    this.queue(null);
  });
                   
  loud.pipe(th).pipe(loud);
});

process.stdin.pipe(tr).pipe(process.stdout);
