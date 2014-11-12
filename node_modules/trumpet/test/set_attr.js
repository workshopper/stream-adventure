var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');

test('set attribute', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('input[type=text]');
    elem.setAttribute('value', 'abc');
    
    tr.pipe(concat(function (src) {
        t.equal(
            String(src),
            '<div class="a"><input type="text" value="abc"></div>\n'
        );
    }));
    fs.createReadStream(__dirname + '/set_attr.html').pipe(tr);
});

test('create attribute', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('input[type=text]');
    elem.setAttribute('beep', 'boop');
    
    tr.pipe(concat(function (src) {
        t.equal(
            String(src),
            '<div class="a"><input type="text" value="xyz" beep="boop"></div>\n'
        );
    }));
    fs.createReadStream(__dirname + '/set_attr.html').pipe(tr);
});
