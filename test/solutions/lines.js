var split = require('split');
var through = require('through');

var count = 0;
process.stdin.pipe(split()).pipe(through(function (line) {
    if (count++ % 2) {
        this.queue(line.toString().toUpperCase() + '\n');
    }
    else {
        this.queue(line.toString().toLowerCase() + '\n');
    }
})).pipe(process.stdout);
