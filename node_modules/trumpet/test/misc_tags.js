var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var through = require('through');

test('h1 is first, select h1', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('.a h1');
    elem.getAttribute('value', function (value) {
        t.equal(value, 'ah1');
    });
    fs.createReadStream(__dirname + '/misc_tags.html').pipe(tr);
});

test('h1 is first, select em', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('.a em');
    elem.getAttribute('value', function (value) {
        t.equal(value, 'aem');
    });
    fs.createReadStream(__dirname + '/misc_tags.html').pipe(tr);
});

test('em is first, select h1', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('.b h1');
    elem.getAttribute('value', function (value) {
        t.equal(value, 'bh1');
    });
    fs.createReadStream(__dirname + '/misc_tags.html').pipe(tr);
});

test('em is first, select em', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('.b em');
    elem.getAttribute('value', function (value) {
        t.equal(value, 'bem');
    });
    fs.createReadStream(__dirname + '/misc_tags.html').pipe(tr);
});

test('deeply nested', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('.c h1');
    elem.getAttribute('value', function (value) {
        t.equal(value, 'ch1');
    });
    fs.createReadStream(__dirname + '/misc_tags.html').pipe(tr);
});
