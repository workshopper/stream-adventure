var select = require('../');
var tokenize = require('html-tokenize');

var test = require('tape');
var fs = require('fs');
var through = require('through2');

test(function (t) {
console.error('DISABLED large test');
return t.end();
    t.plan(1);
    
    var s = select();
    s.select('div', function(e) {
      e.createWriteStream().end();
    });
    
    var thr = through.obj(function (chunk, enc, next) {
      next();
    }, function () {
      t.ok(true); // make sure we got through the file.
    });
    
    fs.createReadStream(__dirname + '/large/large.html').pipe(tokenize()).pipe(s).pipe(thr);
    s.resume();
});
