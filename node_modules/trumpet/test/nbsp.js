var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');

var html = 'Category:&nbsp;&nbsp;&nbsp;<select></select>';
var expected = 'Category:&nbsp;&nbsp;&nbsp;<select id="xyz"></select>';

test('&nbsp;', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('select');
    elem.setAttribute('id', 'xyz');
    
    tr.pipe(concat(function (src) {
        t.equal(String(src), expected);
    }));
    tr.end(html);
});
