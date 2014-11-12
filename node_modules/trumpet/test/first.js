var trumpet = require('../');
var fs = require('fs');
var test = require('tape');
var concat = require('concat-stream');

test('first', function (t) {
    t.plan(2);
    var expected = [ 'AAA', 'DDD' ];
    
    var tr = trumpet();
    tr.selectAll('.row *:first-child', function (elem) {
        var ex = expected.shift();
        elem.createReadStream().pipe(concat(function (body) {
            t.equal(body.toString('utf8'), ex);
        }));
    });
    fs.createReadStream(__dirname + '/first.html').pipe(tr);
});
