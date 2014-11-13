var trumpet = require('../');
var through = require('through2');
var fs = require('fs');
var tr = trumpet();

var loud = tr.select('.loud').createStream();
loud.pipe(through(function (buf, enc, next) {
    var self = this;
    setTimeout(function () {
        self.push(buf.toString().toUpperCase());
        next();
    }, 10);
})).pipe(loud);

fs.createReadStream(__dirname + '/../test/loud.html')
    .pipe(tr).pipe(process.stdout)
;
