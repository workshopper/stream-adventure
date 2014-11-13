var select = require('../');
var test = require('tape');
var tokenize = require('html-tokenize');

test('multi select', function (t) {
    t.plan(3);

    var tok = tokenize();
    var sel = select();
    tok.pipe(sel);

    sel.select('*', function(el){
        t.ok(el, 'a');
    });

    sel.select('*', function(el){
        t.ok(el, 'b');
    });

    sel.resume();
    sel.on('end', function () {
        t.ok(true, 'end');
    });

    tok.end(new Buffer('<div></div>'));
});
