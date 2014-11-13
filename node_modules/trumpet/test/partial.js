var test = require('tape');
var trumpet = require('../');
var concat = require('concat-stream');
var fs = require('fs');
var expected = fs.readFileSync(__dirname + '/partial_expected.html', 'utf8');

test('partial html', function (t) {
    t.plan(1);
    var tr = trumpet();
    
    tr.selectAll('script', function(node) {
        node.setAttribute('src', 'updated');
    });
    
    fs.createReadStream(__dirname + '/partial.html')
        .pipe(tr)
        .pipe(concat(function (src) {
            t.equal(src.toString('utf8'), expected);
        }))
    ;
});
