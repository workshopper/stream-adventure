var through = require('through');
var split = require('split');
var combine = require('stream-combiner');

var tr = combine(split(), through(write));
process.stdin.pipe(tr).pipe(process.stdout);

function write (line) {
    this.queue(line.replace(/[A-Za-z]/g, function (s) {
        var c = s.charCodeAt(0);
        return String.fromCharCode(
            c < 97
            ? (c - 97 + 13) % 26 + 97
            : (c - 65 + 13) % 26 + 97
        );
    }));
}
