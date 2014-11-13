var trumpet = require('../');
var fs = require('fs');
var through = require('through');
var test = require('tape');
var concat = require('concat-stream');

test('through stream thrice', function (t) {
    t.plan(1);
    
    var tr = trumpet();
    tr.selectAll('div', function (div) {
        var ts = div.createStream();
        ts.pipe(through(function (buf) {
            this.queue(buf.toString().toUpperCase());
        })).pipe(ts);
    });
    
    tr.pipe(concat(function (body) {
        t.equal(
            body.toString(),
            '<html>\n<body>\n'
            + '<div>ABC</div>\n'
            + '<div>DEF</div>\n'
            + '<div>GHI</div>\n'
            + '</body>\n</html>\n'
        );
    }));
    
    fs.createReadStream(__dirname + '/triple_through_stream.html').pipe(tr);
});
