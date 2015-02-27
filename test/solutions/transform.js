var through = require('through2');
process.stdin.pipe(through(function (buf, _, next) {
    this.push(buf.toString().toUpperCase());
    next();
})).pipe(process.stdout);
