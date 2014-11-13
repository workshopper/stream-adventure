var trumpet = require('../');
var fs = require('fs');
var test = require('tape');

test('get attribute', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('.b input[type=text]');
    elem.getAttribute('value', function (value) {
        t.equal(value, '¡¡¡');
    });
    fs.createReadStream(__dirname + '/get_attr.html').pipe(tr);
});

test('get 1 div', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('div');
    elem.getAttribute('class', function (value) {
        t.equal(value, 'a');
    });
    fs.createReadStream(__dirname + '/get_attr.html').pipe(tr);
});

test('get all divs', function (t) {
    t.plan(2);
    var names = [ 'a', 'b' ];
    
    var tr = trumpet();
    tr.selectAll('div', function (elem) {
        elem.getAttribute('class', function (value) {
            t.equal(value, names.shift());
        });
    });
    fs.createReadStream(__dirname + '/get_attr.html').pipe(tr);
});
