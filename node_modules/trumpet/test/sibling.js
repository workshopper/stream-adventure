var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var through = require('through');

test('sibling selector', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('.b + .d');
    elem.getAttribute('class', function (value) {
        t.equal(value, 'd');
    });
    fs.createReadStream(__dirname + '/sibling.html').pipe(tr);
});

test('sibling no-match selector', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('.c + .d');
    elem.getAttribute('class', function (value) {
        t.fail('should not have matched');
    });
    fs.createReadStream(__dirname + '/sibling.html').pipe(tr);
    
    tr.pipe(through(null, function () { t.ok(true) }));
});
