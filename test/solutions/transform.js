var through = require('through');
process.stdin.pipe(through(function (buf) {
    this.queue(buf.toString().toUpperCase());
})).pipe(process.stdout);
