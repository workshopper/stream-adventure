var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var through = require('through');

test('child selector', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('.c > input[type=text]');
    elem.getAttribute('value', function (value) {
        t.equal(value, 'abc');
    });
    fs.createReadStream(__dirname + '/child.html').pipe(tr);
});

test('child no-match selector', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    tr.pipe(through(null, function () {
        t.ok(true);
    }));
    var elem = tr.select('.b > input[type=text]');
    elem.getAttribute('value', function (value) {
        t.fail('should not have matched');
    });
    fs.createReadStream(__dirname + '/child.html').pipe(tr);
});

test('child start then no match selector', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    tr.pipe(through(null, function () {
        t.ok(true);
    }));
    var elem = tr.select('.b > .d');
    elem.getAttribute('class', function (value) {
        t.fail('should not have matched');
    });
    fs.createReadStream(__dirname + '/child.html').pipe(tr);
});

test('child with similar grandchild selector', function (t) {
    t.plan(2);
    
    var tr = trumpet();
    tr.selectAll('.a > div', function (elem) {
        elem.getAttribute('class', function (value) {
            t.notEqual(value, 'c', 'should not have matched');
        });
    });
    fs.createReadStream(__dirname + '/child.html').pipe(tr);
});
