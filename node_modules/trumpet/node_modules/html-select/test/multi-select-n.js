var select = require('../');
var test = require('tape');
var tokenize = require('html-tokenize');

test('multi select', function (t) {
    t.plan(10 * 3 + 1);
    
    var tok = tokenize();
    var sel = select();
    tok.pipe(sel);
    
    var times = 0;
    for (var i = 0; i < 10; i++) {
        sel.select('*', function (el){
            t.equal(el.name, [ 'a', 'b', 'c' ][Math.floor(times++ / 10)]);
        });
    }
    
    sel.resume();
    sel.on('end', function () {
        t.ok(true, 'end');
    });
    
    tok.end(new Buffer('<a></a><b><c></c></b>'));
});
