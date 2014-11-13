var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');

test('set attributes', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    tr.selectAll('input[type=text]', function (elem) {
        elem.setAttribute('value', elem.getAttribute('value').toUpperCase());
    });
    
    tr.pipe(concat(function (src) {
        t.equal(
            String(src),
            '<div class="a"><input type="text" value="XYZ"></div>\n'
            + '<div class="a"><input type="text" value="GHI"></div>\n'
        );
    }));
    fs.createReadStream(__dirname + '/set_attrs.html').pipe(tr);
});

test('create attributes', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    tr.selectAll('input[type=text]', function (elem) {
        elem.setAttribute('beep', 'boop');
    });
    
    tr.pipe(concat(function (src) {
        t.equal(
            String(src),
            '<div class="a"><input type="text" value="xyz" beep="boop"></div>\n'
            + '<div class="a"><input type="text" value="ghi" beep="boop"></div>\n'
        );
    }));
    fs.createReadStream(__dirname + '/set_attrs.html').pipe(tr);
});
