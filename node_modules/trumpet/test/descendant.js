var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var through = require('through');

test('descendant selector', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('.a input[type=text]');
    elem.getAttribute('value', function (value) {
        t.equal(value, 'abc');
    });
    fs.createReadStream(__dirname + '/descendant.html').pipe(tr);
});

test('descendant no-match selector', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('.b .d');
    elem.getAttribute('class', function (value) {
        t.fail('should not have matched');
    });
    fs.createReadStream(__dirname + '/descendant.html').pipe(tr);
    
    tr.pipe(through(null, function () { t.ok(true) }));
});
