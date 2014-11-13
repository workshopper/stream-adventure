var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');

test('remove attribute', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    var elem = tr.select('input[type=text]');
    elem.removeAttribute('zzz');
    
    tr.pipe(concat(function (src) {
        t.equal(
            String(src),
            '<div class="a"><input type="text" value="xyz"></div>\n'
        );
    }));
    fs.createReadStream(__dirname + '/rm_attr.html').pipe(tr);
});
