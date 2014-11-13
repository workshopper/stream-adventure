var trumpet = require('../');
var fs = require('fs');
var through = require('through');
var duplexer = require('duplexer');
var concat = require('concat-stream');
var coffee = require('coffee-script');

var coffeeStream = (function () {
    var input = concat(function (body) {
        output.queue(coffee.compile(body.toString('utf8')));
        output.queue(null);
    });
    var output = through();
    return duplexer(input, output);
})();

var tr = trumpet();
tr.pipe(process.stdout);

var stream = tr.createStream('script[type="coffee-script"]');
stream.pipe(coffeeStream).pipe(stream);
fs.createReadStream(__dirname + '/html/inline_coffee.html').pipe(tr);
