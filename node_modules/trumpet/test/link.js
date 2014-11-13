var trumpet = require('../');
var fs = require('fs');
var through = require('through');
var test = require('tape');
var concat = require('concat-stream');

test('write stream', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var link = tr.select('a');
    var ws = link.createWriteStream();
    link.setAttribute('href', '/beep');
    
    var s = through();
    s.pipe(ws);
    
    s.write('beep');
    
    setTimeout(function () {
        s.write(' boop.');
        s.end();
    }, 500);
    
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<html><body><a href="/beep">beep boop.</a></body></html>'
        );
    }));
    tr.end('<html><body><a></a></body></html>');
});
