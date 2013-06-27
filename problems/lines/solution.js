var through = require('through');
var split = require('split');

var lineCount = 0;
var tr = through(function (buf) {
    var line = buf.toString();
    this.queue(lineCount % 2 === 0
        ? line.toLowerCase() + '\n'
        : line.toUpperCase() + '\n'
    );
    lineCount ++;
});
process.stdin.pipe(split()).pipe(tr).pipe(process.stdout);
